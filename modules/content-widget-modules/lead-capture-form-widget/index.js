const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Lead Capture Form',
    icon: 'form-select-icon',
    description: 'A styled lead capture form with name, email, and phone fields',
    previewImage: 'svg'
  },
  icons: {
    'form-select-icon': 'FormSelect'
  },
  fields: {
    add: {
      formTitle: {
        type: 'string',
        label: 'Form Title (optional)',
        help: 'Display a title above the form'
      },
      buttonText: {
        type: 'string',
        label: 'Submit Button Text',
        def: 'Request callback'
      },
      buttonColor: {
        type: 'color',
        label: 'Button Color',
        def: '#2265CA'
      },
      successMessage: {
        type: 'string',
        label: 'Success Message',
        def: "We'll get back to you soon!"
      },
      errorMessage: {
        type: 'string',
        label: 'Error Message',
        def: 'Something went wrong. Please try again.'
      },
      formAction: {
        type: 'string',
        label: 'Form Action URL',
        help: 'Where the form data should be submitted (e.g., /api/lead-capture)'
      },
      showPhoneField: {
        type: 'boolean',
        label: 'Show Phone Number Field',
        def: true
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
