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
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
