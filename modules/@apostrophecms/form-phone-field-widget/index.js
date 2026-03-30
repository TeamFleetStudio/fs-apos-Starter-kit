module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Phone Number Field',
    icon: 'phone-icon'
  },
  icons: {
    'phone-icon': 'Phone'
  },
  fields: {
    add: {
      placeholder: {
        label: 'Placeholder',
        type: 'string',
        help: 'Placeholder text for the phone number input',
        def: 'Enter your phone number'
      },
      defaultCountry: {
        label: 'Default Country',
        type: 'string',
        help: 'ISO 3166-1 alpha-2 country code (e.g. in, us, gb, ae)',
        def: 'in'
      }
    }
  },
  methods(self) {
    return {
      sanitizeFormField(widget, input, output) {
        output[widget.fieldName] = self.apos.launder.string(input[widget.fieldName]);
      }
    };
  }
};
