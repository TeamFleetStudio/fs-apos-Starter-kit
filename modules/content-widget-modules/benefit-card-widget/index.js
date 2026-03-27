const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Benefit Card Widget',
    icon: 'card-text-icon',
    description: 'A card with icon positioned at top-left, title and description',
    previewImage: 'png'
  },
  icons: {
    'card-text-icon': 'CardText'
  },
  fields: {
    add: {
      icon: {
        type: 'area',
        label: 'Icon Image',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      title: {
        type: 'string',
        label: 'Card Title',
        required: true
      },
      description: {
        type: 'string',
        label: 'Card Description',
        textarea: true
      },
      highlightText: {
        type: 'string',
        label: 'Text to Highlight (will be bold)',
        help: 'Enter text that should appear bold in the description'
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
