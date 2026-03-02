const areaConfig = require('../../../lib/area');
const customAttributesSchema = require('../../../lib/customAttributesSchema');
const aosSchema = require('../../../lib/aosSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Progress Bar Slider',
    description: 'Add Audit Count slider',
    previewImage: 'png'
  },
  fields: {
    add: {
      image: {
        label: 'Image',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            image: {}
          }
        }
      },
      bgColor: {
        type: 'color',
        label: 'Slider Background Color',
        def: '#ffffff'
      },
      sliderBarColor: {
        type: 'color',
        label: 'Slider Bar Color',
        def: '#000000'
      },
      slider: {
        type: 'array',
        label: 'Slider Content',
        titleField: 'auditCount',
        fields: {
          add: {
            auditCount: {
              type: 'string',
              label: 'Title',
              required: true
            },
            description: {
              type: 'string',
              label: 'Description',
              required: true
            },
            titleTextColor: {
              type: 'color',
              label: 'Title Text Color',
              def: '#000000'
            },
            descriptionTextColor: {
              type: 'color',
              label: 'Description Text Color',
              def: '#434f51'
            }
          }
        }
      },
      icon: {
        label: 'Slider Icon',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            image: {}
          }
        }
      },
      bgImg: {
        label: 'Background Image',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            image: {}
          }
        }
      },
      tagline: {
        type: 'string',
        label: 'Tagline'
      },
      content: {
        type: 'area',
        label: 'Content',
        required: true,
        options: {
          widgets: {
            ...areaConfig.richText,
            'button-strip': {}
          }
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
