module.exports = {
  methods(self) {
    return {
      checkRequired(req, widget, input) {
        if (widget.required) {
          const value = input[widget.fieldName];
          // Trim string values so whitespace-only doesn't pass
          if (!value || (typeof value === 'string' && !value.trim())) {
            const message = widget.errorMessage || req.t('aposForm:requiredError');
            throw self.apos.error('invalid', {
              fieldError: {
                field: widget.fieldName,
                error: 'required',
                message: message
              }
            });
          }
        }
      },
      sanitizeFormField(widget, input, output) {
        const value = self.apos.launder.string(input[widget.fieldName]);
        output[widget.fieldName] = value;

        // Email format validation
        if (widget.inputType === 'email' && value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            throw self.apos.error('invalid', {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                message: 'Please enter a valid email address'
              }
            });
          }
        }
      }
    };
  }
};
