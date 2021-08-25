import { mount } from '@vue/test-utils';

import ImageUpload from '@/components/widgets/ImageUpload';

// https://zaengle.com/blog/mocking-file-upload-in-vue-with-jest

describe('ImageUpload component', () => {
  test('Test ImageUpload component', async () => {
    // Arrange
    // configure and setup the test

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

    const wrapper = await mount(ImageUpload, {
      propsData: vueProps,
    });

    // Mock FileReader.readAsDataURL() to be a function that returns null
    const fileReaderSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => {
      console.log('Filereader read as data url is called');
    });
    
    // Spy on the component’s handleFile() method
    const handleFileSpy = jest.spyOn(wrapper.vm, 'handleFile');
 
    // Manually trigger the component’s onChange() method
    // Act: perfom actions to change the state
    wrapper.vm.upload(event);

    // Assert
    // check if the state is as what expected to be
    expect(fileReaderSpy).toHaveBeenCalledWith(event.target.files[0]);
    expect(handleFileSpy).toHaveBeenCalledWith(event.target.files[0]);

    // reader.onload() is not called
    // -> therefore no updated base64 string
    // -> cannot see if canvas has content

    // expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    // 1. Modelvalue has base64 String
    // expect(wrapper.vm.modelValue).toContain('base64,');
    // console.log(wrapper);
  });
}); 