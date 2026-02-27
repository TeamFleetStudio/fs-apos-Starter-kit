const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    icon: 'image-icon',
    label: 'Simple Image',
    description: 'Display an image without caption content',
    previewImage: 'jpg',
    className: 'img-fluid',
    loadingType: 'lazy'
  },
  fields: {
    add: {
      _image: {
        type: 'relationship',
        withType: '@apostrophecms/image',
        label: 'Image',
        required: true,
        max: 1
      },
      imageClass: {
        type: 'string',
        label: 'Image Class Name',
        help: 'It can be used to write custom code'
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};

