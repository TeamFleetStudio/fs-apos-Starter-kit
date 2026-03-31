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
              type: 'codeEditor',
              label: 'Custom SVG',
              languages: [
                { label: 'HTML', value: 'html' }
              ],
              defaultLanguage: 'html',
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
                { label: 'Start', value: 'start' },
                { label: 'End', value: 'end' }
              ]
            },
            iconVerticalAlign: {
              type: 'select',
              label: 'Icon Vertical Alignment',
              def: 'center',
              choices: [
                { label: 'Top', value: 'start' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'end' }
              ]
            },
            iconSize: {
              type: 'range',
              label: 'Icon Size (px)',
              min: 12,
              max: 500,
              step: 4,
              def: 20,
              if: {
                iconType: 'image'
              }
            },
            iconBackground: {
              type: 'color',
              label: 'Icon Background Color',
              help: 'Background color for the icon (e.g., #dcfce7 for light green)'
            },
            iconBorderRadius: {
              type: 'range',
              label: 'Icon Border Radius (px)',
              min: 0,
              max: 50,
              step: 1,
              def: 0
            },
            iconBorderWidth: {
              type: 'range',
              label: 'Icon Border Width (px)',
              min: 0,
              max: 10,
              step: 1,
              def: 0
            },
            iconBorderColor: {
              type: 'color',
              label: 'Icon Border Color'
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
