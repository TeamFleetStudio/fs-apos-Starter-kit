const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Image Gallery',
    description: 'Add a gallery of images to your page',
    previewImage: 'jpg',
    icon: 'image-gallery-icon'
  },
  icons: {
    'image-gallery-icon': 'ImageAlbum'
  },
  fields: {
    add: {
      displayType: {
        type: 'select',
        label: 'Slide display type',
        required: true,
        choices: [
          {
            label: 'Large, single slide',
            value: 1,
            def: true
          },
          {
            label: 'Three slides',
            value: 3
          },
          {
            label: 'Four slides',
            value: 4
          }
        ]
      },
      _images: {
        type: 'relationship',
        withType: '@apostrophecms/image',
        label: 'Images',
        required: true,
        max: 10
      },
      arrowBgColor: {
        type: 'color',
        label: 'Arrow Background Color',
        def: '#000000'
      },
      arrowIconColor: {
        type: 'color',
        label: 'Arrow Icon Color',
        def: '#ffffff'
      },
      arrowBorder: {
        type: 'boolean',
        label: 'Show Arrow Border',
        def: false
      },
      arrowBorderColor: {
        type: 'color',
        label: 'Arrow Border Color',
        def: '#ffffff',
        if: {
          arrowBorder: true
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
