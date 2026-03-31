const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');
const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Icon Bullet List Widget',
    icon: 'format-list-checks-icon',
    description: 'A list of items with custom icons as bullets'
  },
  icons: {
    'format-list-checks-icon': 'FormatListChecks'
  },
  fields: {
    add: {
      items: {
        type: 'array',
        label: 'List Items',
        fields: {
          add: {
            iconType: {
              type: 'select',
              label: 'Icon Type',
              def: 'svg',
              choices: [
                { label: 'Custom SVG', value: 'svg' },
                { label: 'Image', value: 'image' }
              ]
            },
            customSvg: {
              type: 'string',
              label: 'Custom SVG',
              help: 'Paste your SVG HTML code here',
              textarea: true,
              if: {
                iconType: 'svg'
              }
            },
            iconImage: {
              type: 'area',
              label: 'Icon Image',
              options: {
                max: 1,
                widgets: {
                  '@apostrophecms/image': {}
                }
              },
              if: {
                iconType: 'image'
              }
            },
            iconPlacement: {
              type: 'select',
              label: 'Icon Placement',
              def: 'start',
              choices: [
                { label: 'Start (Left)', value: 'start' },
                { label: 'End (Right)', value: 'end' }
              ]
            },
            iconBackground: {
              type: 'color',
              label: 'Icon Background Color',
              help: 'Background color for the icon (e.g., #dcfce7 for light green)'
            },
            iconBorderRadius: {
              type: 'string',
              label: 'Icon Border Radius',
              help: 'e.g., 50% for circle, 8px for rounded, 0 for square'
            },
            iconBorder: {
              type: 'string',
              label: 'Icon Border',
              help: 'e.g., 1px solid #ccc, 2px solid #10B981'
            },
            content: {
              type: 'area',
              label: 'Content',
              options: {
                widgets: {
                  ...areaConfig.richText
                }
              }
            }
          }
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    },
    group: {
      basics: {
        label: 'Content',
        fields: ['items']
      },
      customAttribute: {
        label: 'Custom Attribute',
        fields: ['animationEffects', 'customClassName', 'customId']
      }
    }
  }
};
