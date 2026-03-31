module.exports = {
  fields: {
    add: {
      errorMessage: {
        label: 'Custom Error Message',
        type: 'string',
        help: 'Shown when this field fails validation. Leave blank for default.'
      }
    }
  },
  methods(self) {
    return {
      checkRequired(req, widget, input) {
        if (widget.required && !input[widget.fieldName]) {
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
    };
  }
};
