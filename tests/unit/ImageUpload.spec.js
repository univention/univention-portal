import { mount } from '@vue/test-utils';

import ImageUpload from '@/components/widgets/ImageUpload';


describe('ImageUpload.vue', () => {
  test('uploading image', async () => {
    const vueProps = {
      label: 'Example Image',
      modelValue: '',
    }

    const event = {
      target: {
        files: [
          {
            name: 'image.png',
            size: 5000,
            type: 'image/png',
          },
        ],
      },
    }
    const imageResult = 'data:image/png;base64__TEST';

    const wrapper = await mount(ImageUpload, {
      propsData: vueProps,
    });

    // Spy on Filereader
    jest.spyOn(global, 'FileReader').mockImplementation(function () {
        this.readAsDataURL = jest.fn();
    });

    // Spy on handleFile method
    const handleFileSpy = jest.spyOn(wrapper.vm, 'handleFile');
    
    let imagePreview = wrapper.find(`[data-test="imagePreview--${vueProps.label}"]`);    

    expect(imagePreview.exists()).toBe(false);

    // trigger upload event with test data
    wrapper.vm.upload(event);
    const reader = FileReader.mock.instances[0];

    expect(reader.readAsDataURL).toHaveBeenCalledWith(event.target.files[0]);
    expect(reader.onload).toStrictEqual(expect.any(Function));
    
    reader.onload({ target: { result: imageResult } });

    // expect update emmiter to be triggered
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');

    // expect handleFile() to be called
    expect(handleFileSpy).toHaveBeenCalledWith(event.target.files[0]);

    // await instance to update
    await wrapper.vm.$nextTick();

    // reassign since instance is updated. 
    imagePreview = wrapper.find(`[data-test="imagePreview--${vueProps.label}"]`);

    expect(imagePreview.attributes('src')).toContain(imageResult);
  });
  test('removing existing image', async () => {
    const imageResult = 'data:image/png;base64__TEST';

    const vueProps = {
      label: 'Example Image',
      modelValue: imageResult,
    }

    const wrapper = await mount(ImageUpload, {
      propsData: vueProps,
    });

    // Spy on remove method
    const removeSpy = jest.spyOn(wrapper.vm, 'remove');
    
    let imagePreview = wrapper.find(`[data-test="imagePreview--${vueProps.label}"]`);    

    expect(imagePreview.exists()).toBe(true);
    expect(imagePreview.attributes('src')).toContain(imageResult);

    // trigger upload event with test data
    wrapper.vm.remove();

    // expect update emmiter to be triggered
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');

    // expect remove() to be called
    expect(removeSpy).toHaveBeenCalled();

    // await instance to update
    await wrapper.vm.$nextTick();

    // reassign since instance is updated. 
    imagePreview = wrapper.find(`[data-test="imagePreview--${vueProps.label}"]`);

    expect(imagePreview.exists()).toBe(false);
  });
}); 