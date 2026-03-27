const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Comparison Table Widget',
    icon: 'table-icon',
    description: 'A comparison table to show feature differences between options',
    previewImage: 'png'
  },
  icons: {
    'table-icon': 'Table'
  },
  fields: {
    add: {
      columns: {
        type: 'array',
        label: 'Column Headers',
        titleField: 'title',
        min: 2,
        max: 5,
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Column Title',
              required: true
            },
            isHighlighted: {
              type: 'boolean',
              label: 'Highlight this column (styled as primary)',
              def: false
            },
            highlightColor: {
              type: 'color',
              label: 'Highlight Background Color',
              def: '#2265CA',
              if: {
                isHighlighted: true
              }
            }
          }
        }
      },
      rows: {
        type: 'array',
        label: 'Feature Rows',
        titleField: 'featureName',
        fields: {
          add: {
            featureName: {
              type: 'string',
              label: 'Feature Name',
              required: true
            },
            col1Value: {
              type: 'select',
              label: 'Column 1 Value',
              choices: [
                { label: 'Checkmark (✓)', value: 'check' },
                { label: 'Cross (✗)', value: 'cross' },
                { label: 'Custom Text', value: 'text' }
              ],
              def: 'cross'
            },
            col1Text: {
              type: 'string',
              label: 'Column 1 Custom Text',
              if: {
                col1Value: 'text'
              }
            },
            col2Value: {
              type: 'select',
              label: 'Column 2 Value',
              choices: [
                { label: 'Checkmark (✓)', value: 'check' },
                { label: 'Cross (✗)', value: 'cross' },
                { label: 'Custom Text', value: 'text' }
              ],
              def: 'cross'
            },
            col2Text: {
              type: 'string',
              label: 'Column 2 Custom Text',
              if: {
                col2Value: 'text'
              }
            },
            col3Value: {
              type: 'select',
              label: 'Column 3 Value',
              choices: [
                { label: 'Checkmark (✓)', value: 'check' },
                { label: 'Cross (✗)', value: 'cross' },
                { label: 'Custom Text', value: 'text' }
              ],
              def: 'check'
            },
            col3Text: {
              type: 'string',
              label: 'Column 3 Custom Text',
              if: {
                col3Value: 'text'
              }
            },
            col4Value: {
              type: 'select',
              label: 'Column 4 Value',
              choices: [
                { label: 'Checkmark (✓)', value: 'check' },
                { label: 'Cross (✗)', value: 'cross' },
                { label: 'Custom Text', value: 'text' },
                { label: 'Not Used', value: 'none' }
              ],
              def: 'none'
            },
            col4Text: {
              type: 'string',
              label: 'Column 4 Custom Text',
              if: {
                col4Value: 'text'
              }
            }
          }
        }
      },
      tableClass: {
        type: 'string',
        label: 'Additional Table CSS Classes'
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
