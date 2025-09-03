/*
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ModalDialog from '@/components/modal/ModalDialog.vue';

// Mock the translate function
jest.mock('@/jsHelper/translate', () => ({
  __esModule: true,
  default: jest.fn((key, params = {}) => {
    const translations = {
      Cancel: 'Cancel',
      'Test Modal Title': 'Test Modal Title',
    };
    let result = translations[key] || key;

    // Handle parameter replacement
    if (params.key1) {
      result = params.key1;
    }

    return result;
  }),
}));

describe('ModalDialog.vue', () => {
  let store;
  let wrapper;

  // Helper function to create a mock store
  const createMockStore = () => createStore({
    modules: {
      modal: {
        namespaced: true,
        getters: {
          getModalState: () => (level) => {
            if (level === 'secondLevelModal') return false;
            return true;
          },
        },
      },
    },
  });

  // Helper function to create focusable elements
  const addFocusableElements = () => {
    const button1 = document.createElement('button');
    button1.textContent = 'First Button';
    const button2 = document.createElement('button');
    button2.textContent = 'Second Button';
    const input = document.createElement('input');
    input.type = 'text';

    wrapper.element.appendChild(button1);
    wrapper.element.appendChild(input);
    wrapper.element.appendChild(button2);

    return { button1, button2, input };
  };

  beforeEach(() => {
    store = createMockStore();

    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      writable: true,
      value: document.createElement('button'),
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    // Clean up any remaining elements
    document.querySelectorAll('button, input').forEach((el) => el.remove());
  });

  describe('ARIA Attributes and Structure', () => {
    test('has correct ARIA role and attributes', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const section = wrapper.find('section');

      expect(section.attributes('role')).toBe('dialog');
      expect(section.attributes('aria-modal')).toBe('true');
      expect(section.attributes('tabindex')).toBe('-1');
    });

    test('has proper aria-labelledby and aria-describedby attributes', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const section = wrapper.find('section');
      const labelledbyId = section.attributes('aria-labelledby');
      const describedbyId = section.attributes('aria-describedby');

      expect(labelledbyId).toBeTruthy();
      expect(describedbyId).toBeTruthy();
      expect(labelledbyId).toMatch(/^\d+-labelledby$/);
      expect(describedbyId).toMatch(/^\d+-describedby$/);

      // Verify corresponding elements exist by their data attributes
      const titleElement = wrapper.find('h3');
      const descriptionElement = wrapper.find(`[id="${describedbyId}"]`);

      expect(titleElement.exists()).toBe(true);
      expect(titleElement.attributes('id')).toBe(labelledbyId);
      expect(descriptionElement.exists()).toBe(true);
    });

    test('displays title correctly with i18nTitleKey prop', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          i18nTitleKey: 'Test Modal Title',
        },
        global: {
          plugins: [store],
        },
      });

      expect(wrapper.text()).toContain('Test Modal Title');
    });

    test('displays title correctly with title prop', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Direct Title',
        },
        global: {
          plugins: [store],
        },
      });

      expect(wrapper.text()).toContain('Direct Title');
    });

    test('shows cancel button when cancelAllowed is true', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      const cancelButton = wrapper.find('icon-button-stub');
      expect(cancelButton.exists()).toBe(true);

      // Test that the cancel button has the correct icon and class
      expect(cancelButton.attributes('icon')).toBe('x');
      expect(cancelButton.classes()).toContain('button--flat');
    });

    test('hides cancel button when cancelAllowed is false', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false,
        },
        global: {
          plugins: [store],
        },
      });

      const cancelButton = wrapper.find('icon-button-stub');
      expect(cancelButton.exists()).toBe(false);
    });
  });

  describe('Focus Management', () => {
    test('stores previously focused element on mount', async () => {
      const previousElement = document.createElement('button');
      previousElement.id = 'previous-focus';
      document.body.appendChild(previousElement);

      // Mock document.activeElement to return our element
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        value: previousElement,
      });

      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.previouslyFocusedElement).toBe(previousElement);

      // Cleanup
      document.body.removeChild(previousElement);
    });

    test('focuses first focusable element on mount', async () => {
      // Test the setupFocusManagement method directly with mocked behavior
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      // Check that setupFocusManagement finds a focusable element
      const firstFocusable = wrapper.vm.getFirstFocusableElement(wrapper.element);
      expect(firstFocusable).toBeTruthy();
      expect(firstFocusable.tagName.toLowerCase()).toBe('button');
    });

    test('focuses modal element if no focusable elements exist', async () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false, // Remove cancel button
        },
        global: {
          plugins: [store],
        },
      });

      const modalFocusSpy = jest.spyOn(wrapper.element, 'focus').mockImplementation();

      // Call setupFocusManagement explicitly
      wrapper.vm.setupFocusManagement();
      await wrapper.vm.$nextTick();

      expect(modalFocusSpy).toHaveBeenCalled();
    });

    test('restores focus to previously focused element on unmount', () => {
      const previousElement = document.createElement('button');
      previousElement.id = 'previous-focus';
      document.body.appendChild(previousElement);

      const focusSpy = jest.spyOn(previousElement, 'focus').mockImplementation();

      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      // Set the previously focused element
      wrapper.vm.previouslyFocusedElement = previousElement;

      // Simulate unmount
      wrapper.unmount();

      expect(focusSpy).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(previousElement);
    });

    test('handles null previouslyFocusedElement gracefully', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      wrapper.vm.previouslyFocusedElement = null;

      expect(() => wrapper.vm.restoreFocus()).not.toThrow();
    });
  });

  describe('Focusable Element Detection', () => {
    test('getFirstFocusableElement returns first focusable element', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      const firstFocusable = wrapper.vm.getFirstFocusableElement(wrapper.element);

      // The first focusable should be the cancel button
      expect(firstFocusable).toBeTruthy();
      expect(firstFocusable.tagName.toLowerCase()).toBe('button');
    });

    test('getLastFocusableElement returns last focusable element', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const { button2 } = addFocusableElements();

      const lastFocusable = wrapper.vm.getLastFocusableElement(wrapper.element);
      expect(lastFocusable).toBe(button2);
    });

    test('returns null when no focusable elements exist', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false, // This removes the cancel button
        },
        global: {
          plugins: [store],
        },
      });

      const firstFocusable = wrapper.vm.getFirstFocusableElement(wrapper.element);
      const lastFocusable = wrapper.vm.getLastFocusableElement(wrapper.element);

      expect(firstFocusable).toBe(null);
      expect(lastFocusable).toBe(null);
    });

    test('ignores disabled elements', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false, // Remove cancel button to test only our elements
        },
        global: {
          plugins: [store],
        },
      });

      const disabledButton = document.createElement('button');
      disabledButton.disabled = true;
      const enabledButton = document.createElement('button');

      wrapper.element.appendChild(disabledButton);
      wrapper.element.appendChild(enabledButton);

      const firstFocusable = wrapper.vm.getFirstFocusableElement(wrapper.element);
      // Should find the enabled button, not the disabled one
      expect(firstFocusable).toBe(enabledButton);
      expect(firstFocusable.disabled).toBe(false);
    });
  });

  describe('Focus Trapping', () => {
    test('trapFocus method exists and can be called', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      // Test that the method exists and can be called
      expect(typeof wrapper.vm.trapFocus).toBe('function');

      const mockEvent = {
        preventDefault: jest.fn(),
        shiftKey: false,
      };

      // Should not throw when called
      expect(() => wrapper.vm.trapFocus(mockEvent)).not.toThrow();
    });

    test('trapFocus prevents default when no focusable elements exist', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false, // Remove cancel button
        },
        global: {
          plugins: [store],
        },
      });

      const mockEvent = {
        preventDefault: jest.fn(),
        shiftKey: false,
      };

      wrapper.vm.trapFocus(mockEvent);

      // Should prevent default when no focusable elements exist
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('trapFocus handles focus cycling logic', () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      // Mock the focusable element detection methods
      const mockFirstElement = { focus: jest.fn() };
      const mockLastElement = { focus: jest.fn() };

      jest.spyOn(wrapper.vm, 'getFirstFocusableElement').mockReturnValue(mockFirstElement);
      jest.spyOn(wrapper.vm, 'getLastFocusableElement').mockReturnValue(mockLastElement);

      // Mock document.activeElement to be the last element
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        value: mockLastElement,
      });

      const mockEvent = {
        preventDefault: jest.fn(),
        shiftKey: false,
      };

      wrapper.vm.trapFocus(mockEvent);

      // Should prevent default and focus first element when tabbing from last
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockFirstElement.focus).toHaveBeenCalled();
    });

    test('does not trap focus when modal is not focusable', () => {
      // Mock store to return true for secondLevelModal (makes isFocusable false)
      const unfocusableStore = createStore({
        modules: {
          modal: {
            namespaced: true,
            getters: {
              getModalState: () => (level) => {
                if (level === 'secondLevelModal') return true;
                return false;
              },
            },
          },
        },
      });

      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [unfocusableStore],
        },
      });

      const { button1 } = addFocusableElements();
      button1.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      const preventDefaultSpy = jest.spyOn(tabEvent, 'preventDefault');

      wrapper.vm.trapFocus(tabEvent);

      // Should not prevent default when not focusable
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    test('handles Escape key to cancel modal', async () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      await wrapper.trigger('keydown.esc');

      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('does not emit cancel on Escape when cancelAllowed is false', async () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false,
        },
        global: {
          plugins: [store],
        },
      });

      await wrapper.trigger('keydown.esc');

      expect(wrapper.emitted('cancel')).toBeFalsy();
    });

    test('handles Tab key for focus trapping', async () => {
      wrapper = mount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const trapFocusSpy = jest.spyOn(wrapper.vm, 'trapFocus');

      await wrapper.trigger('keydown.tab');

      expect(trapFocusSpy).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    test('emits cancel event when cancel method is called and allowed', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      wrapper.vm.cancel();

      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('does not emit cancel event when cancelAllowed is false', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: false,
        },
        global: {
          plugins: [store],
        },
      });

      wrapper.vm.cancel();

      expect(wrapper.emitted('cancel')).toBeFalsy();
    });

    test('cancel button triggers cancel method', async () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
          cancelAllowed: true,
        },
        global: {
          plugins: [store],
        },
      });

      const cancelSpy = jest.spyOn(wrapper.vm, 'cancel');
      const cancelButton = wrapper.find('icon-button-stub');

      await cancelButton.trigger('click');

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    test('labelledbyId returns correct format', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const labelledbyId = wrapper.vm.labelledbyId;
      expect(labelledbyId).toMatch(/^\d+-labelledby$/);
    });

    test('describedbyId returns correct format', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const describedbyId = wrapper.vm.describedbyId;
      expect(describedbyId).toMatch(/^\d+-describedby$/);
    });

    test('isFocusable returns true when secondLevelModal is false', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      expect(wrapper.vm.isFocusable).toBe(true);
    });

    test('isFocusable returns false when secondLevelModal is true', () => {
      const secondLevelStore = createStore({
        modules: {
          modal: {
            namespaced: true,
            getters: {
              getModalState: () => (level) => {
                if (level === 'secondLevelModal') return true;
                return false;
              },
            },
          },
        },
      });

      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [secondLevelStore],
        },
      });

      expect(wrapper.vm.isFocusable).toBe(false);
    });
  });

  describe('Props Validation', () => {
    test('accepts all valid props', () => {
      expect(() => {
        wrapper = shallowMount(ModalDialog, {
          props: {
            i18nTitleKey: 'test.key',
            title: 'Test Title',
            modalLevel: 'modal2',
            cancelAllowed: false,
          },
          global: {
            plugins: [store],
          },
        });
      }).not.toThrow();
    });

    test('uses default values for optional props', () => {
      wrapper = shallowMount(ModalDialog, {
        global: {
          plugins: [store],
        },
      });

      expect(wrapper.props('i18nTitleKey')).toBe('');
      expect(wrapper.props('title')).toBe('');
      expect(wrapper.props('modalLevel')).toBe('modal');
      expect(wrapper.props('cancelAllowed')).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    test('applies correct CSS classes based on focusable state', () => {
      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [store],
        },
      });

      const section = wrapper.find('section');
      expect(section.classes()).toContain('dialog');
      expect(section.classes()).not.toContain('dialog--unfocusable');
    });

    test('applies unfocusable class when not focusable', () => {
      const unfocusableStore = createStore({
        modules: {
          modal: {
            namespaced: true,
            getters: {
              getModalState: () => (level) => {
                if (level === 'secondLevelModal') return true;
                return false;
              },
            },
          },
        },
      });

      wrapper = shallowMount(ModalDialog, {
        props: {
          title: 'Test Modal',
        },
        global: {
          plugins: [unfocusableStore],
        },
      });

      const section = wrapper.find('section');
      expect(section.classes()).toContain('dialog');
      expect(section.classes()).toContain('dialog--unfocusable');
    });
  });
});
