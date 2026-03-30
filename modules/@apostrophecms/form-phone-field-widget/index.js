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
        const value = self.apos.launder.string(input[widget.fieldName]);
        output[widget.fieldName] = value;

        // Phone number format validation (E.164: + followed by 7-15 digits)
        if (value && value.trim()) {
          const phoneRegex = /^\+?[1-9]\d{6,14}$/;
          if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
            throw self.apos.error('invalid', {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                message: 'Please enter a valid phone number'
              }
            });
          }
        }
      }
    };
  }
};
