const buttonSchema = require('../../../lib/buttonSchema');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'CTA Button',
    icon: 'button-icon',
    description: 'Add call to action button to your page',
    previewImage: 'svg'
  },
  icons: {
    'button-icon': 'ShapeRectanglePlus'
  },
  fields: {
    add: {
      ...buttonSchema.button,
      ...customAttributesSchema
    }
  }
};
