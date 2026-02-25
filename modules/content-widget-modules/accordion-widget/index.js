const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Accordion',
    icon: 'menu-open-icon',
    description: 'Add expandable content to your page',
    previewImage: 'svg'
  },
  icons: {
    'menu-open-icon': 'MenuOpen'
  },
  fields: {
    add: {
      groupTitle: {
        type: 'string',
        label: 'Group Title'
      },
      accordions: {
        type: 'array',
        label: 'Accordions',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            content: {
              type: 'area',
              label: 'Content',
              required: true,
              options: {
                widgets: areaConfig.apos
              }
            }
          }
        }
      },
      widgetClass: {
        type: 'string',
        help: 'It can be use to write custom css',
        label: 'Widget class name'
      }
    }
  }
};
