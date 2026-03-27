const customAttributesSchema = require('../../../lib/customAttributesSchema');
const aosSchema = require('../../../lib/aosSchema.js');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Logo Grid',
    icon: 'view-grid-icon',
    description: 'Display logos/images in a responsive grid layout with wrapping',
    previewImage: 'svg'
  },
  icons: {
    'view-grid-icon': 'ViewGrid'
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Section Title (optional)',
        help: 'Optional title above the logo grid'
      },
      columns: {
        type: 'select',
        label: 'Columns per row (desktop)',
        choices: [
          { label: '2 columns', value: '2' },
          { label: '3 columns', value: '3' },
          { label: '4 columns', value: '4' },
          { label: '5 columns', value: '5' },
          { label: '6 columns', value: '6' }
        ],
        def: '3'
      },
      gap: {
        type: 'select',
        label: 'Gap between items',
        choices: [
          { label: 'Small (8px)', value: 'small' },
          { label: 'Medium (16px)', value: 'medium' },
          { label: 'Large (24px)', value: 'large' }
        ],
        def: 'medium'
      },
      imageStyle: {
        type: 'select',
        label: 'Image Style',
        choices: [
          { label: 'Rounded (pill)', value: 'rounded' },
          { label: 'Rounded corners', value: 'rounded-lg' },
          { label: 'Circle', value: 'circle' },
          { label: 'Square', value: 'square' }
        ],
        def: 'rounded-lg'
      },
      showBorder: {
        type: 'boolean',
        label: 'Show border around images',
        def: false
      },
      bgColor: {
        type: 'color',
        label: 'Background Color',
        def: '#ffffff'
      },
      logos: {
        type: 'array',
        label: 'Logos',
        titleField: 'altText',
        fields: {
          add: {
            image: {
              type: 'area',
              label: 'Logo Image',
              options: {
                max: 1,
                widgets: {
                  '@apostrophecms/image': {}
                }
              }
            },
            altText: {
              type: 'string',
              label: 'Alt Text / Name',
              required: true
            },
            link: {
              type: 'url',
              label: 'Link URL (optional)'
            },
            linkTarget: {
              type: 'select',
              label: 'Link Target',
              choices: [
                { label: 'Same window', value: '_self' },
                { label: 'New tab', value: '_blank' }
              ],
              def: '_blank',
              if: {
                $or: [
                  { link: { $exists: true } }
                ]
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
