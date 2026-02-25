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
        label: 'Slider Background Color'
      },
      slider: {
        type: 'array',
        label: 'Slider Content',
        titleField: 'auditCount',
        fields: {
          add: {
            auditCount: {
              type: 'string',
              label: 'Audit Count',
              required: true
            },
            description: {
              type: 'string',
              label: 'Description',
              required: true
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
