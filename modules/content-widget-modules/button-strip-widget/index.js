const buttonSchema = require('../../../lib/buttonSchema');
const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Buttons',
    icon: 'button-icon'
  },
  icons: {
    'button-icon': 'ShapeRectanglePlus'
  },
  fields: {
    add: {
      buttons: {
        type: 'array',
        label: 'Button strip',
        titleField: 'linkText',
        fields: {
          add: {
            ...buttonSchema.button
          }
        }
      },
      buttonSpacing: {
        type: 'range',
        label: 'Button Spacing',
        help: 'Set the spacing between buttons',
        min: 0,
        max: 50,
        step: 1,
        def: 16
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
