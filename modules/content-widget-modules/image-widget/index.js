const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    icon: 'image-icon',
    label: 'Image',
    description: 'Display an image on your page',
    previewImage: 'jpg',
    className: 'img-fluid',
    loadingType: 'lazy' // Enable native lazy loading for offscreen images
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
      content: {
        type: 'area',
        label: 'Content',
        options: {
          widgets: {
            'rich-text': {},
          }
        }
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
