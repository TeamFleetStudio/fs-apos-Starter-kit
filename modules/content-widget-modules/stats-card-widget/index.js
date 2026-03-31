const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');
const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Stats Card Widget',
    icon: 'chart-box-icon',
    description: 'Display stats with a header icon, title, and stat columns',
    previewImage: 'png'
  },
  icons: {
    'chart-box-icon': 'ChartBox'
  },
  fields: {
    add: {
      headerIcon: {
        type: 'area',
        label: 'Header Icon (appears in circle at top)',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      title: {
        type: 'area',
        label: 'Title & Subtitle',
        options: {
          widgets: {
            ...areaConfig.richText
          }
        }
      },
      bgColor: {
        type: 'color',
        label: 'Background Color',
        def: '#f7faff'
      },
      stats: {
        type: 'array',
        label: 'Statistics',
        titleField: 'label',
        fields: {
          add: {
            icon: {
              type: 'select',
              label: 'Icon',
              choices: [
                { label: 'Custom SVG', value: 'custom-svg' },
                { label: 'Trending Up', value: 'trending-up' },
                { label: 'Sprout', value: 'sprout' },
                { label: 'Briefcase Business', value: 'briefcase-business' },
                { label: 'Users', value: 'users' },
                { label: 'Chart Bar', value: 'chart-bar' },
                { label: 'Chart Line', value: 'chart-line' },
                { label: 'Dollar Sign', value: 'dollar-sign' },
                { label: 'Target', value: 'target' },
                { label: 'Award', value: 'award' },
                { label: 'Rocket', value: 'rocket' },
                { label: 'Zap (Lightning)', value: 'zap' },
                { label: 'Star', value: 'star' },
                { label: 'Heart', value: 'heart' },
                { label: 'Thumbs Up', value: 'thumbs-up' },
                { label: 'Check Circle', value: 'check-circle' },
                { label: 'Globe', value: 'globe' },
                { label: 'Building', value: 'building' },
                { label: 'Graduation Cap', value: 'graduation-cap' },
                { label: 'Clock', value: 'clock' },
                { label: 'Calendar', value: 'calendar' }
              ],
              def: 'custom-svg'
            },
            customSvg: {
              type: 'string',
              label: 'Custom SVG',
              help: 'Paste your SVG code here',
              textarea: true,
              if: {
                icon: 'custom-svg'
              }
            },
            value: {
              type: 'string',
              label: 'Value (e.g., 25%, 109%, 170mn)',
              required: true
            },
            valueColor: {
              type: 'color',
              label: 'Value Color',
              def: '#2360FF'
            },
            label: {
              type: 'area',
              label: 'Label',
              options: {
                widgets: {
                  ...areaConfig.richText
                }
              }
            },
            description: {
              type: 'area',
              label: 'Description',
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
    }
  }
};
