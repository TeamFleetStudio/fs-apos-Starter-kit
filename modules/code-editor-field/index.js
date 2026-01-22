module.exports = {
  init(self) {
    self.apos.schema.addFieldType({
      name: 'codeEditor',
      convert: self.convertInput,
      vueComponent: 'InputCodeEditor'
    });
  },
  methods(self) {
    return {
      async convertInput(req, field, data, object) {
        const input = data[field.name] || {};
        const code = self.apos.launder.string(input.code, '');
        let language = self.apos.launder.string(input.language, field.defaultLanguage || 'javascript');

        // Allowlist languages (never trust the browser)
        const allowed = (field.languages || [
          { value: 'javascript' }, { value: 'html' }, { value: 'css' },
          { value: 'json' }, { value: 'yaml' }, { value: 'markdown' },
          { value: 'python' }, { value: 'sh' }, { value: 'sql' }
        ]).map(l => l.value || l);

        if (!allowed.includes(language)) {
          language = field.defaultLanguage || allowed[0] || 'javascript';
        }

        object[field.name] = { code, language };
      }
    };
  }
};
