const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Specialization Widget',
    description: 'Display specializations with icons and text',
    previewImage: 'svg'
  },
  icons: {
    'cards-icon': 'Cards'
  },
  fields: {
    add: {
      specializations: {
        label: 'Specializations',
        type: 'array',
        titleField: 'title',
        fields: {
          add: {
            title: {
              label: 'Title',
              type: 'string',
              required: true
            },
            logo: {
              label: 'Image',
              type: 'area',
              contextual: true,
              required: true,
              options: {
                max: 1,
                widgets: {
                  '@apostrophecms/image': {}
                }
              }
            },
            description: {
              label: 'Description',
              type: 'area',
              required: true,
              options: {
                max: 1,
                widgets: {
                  ...areaConfig.richText
                }
              }
            },
            url: {
              label: 'URL',
              type: 'url',
            }
          }
        }
      },
      widgetClass: {
        type: 'string',
        help: 'It can be use to write custom css',
        label: 'Widget class name'
      },
      widgetId: {
        type: 'string',
        help: 'Use only for scroll to element.',
        label: 'Widget Id'
      }
    }
  }
};
