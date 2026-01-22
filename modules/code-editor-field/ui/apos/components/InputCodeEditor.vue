<template>
  <AposInputWrapper
    :modifiers="modifiers"
    :field="field"
    :error="effectiveError"
    :uid="uid"
    :display-options="displayOptions"
  >
    <template #body>
      <div class="wrap">
        <template v-if="languageOptions.length > 1">
          <label class="label">Language</label>
          <select class="select" :value="current.language" @change="onLanguageChange($event.target.value)">
            <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </template>

        <div class="editor" ref="editorEl"></div>
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>
import AposInputMixin from 'Modules/@apostrophecms/schema/mixins/AposInputMixin';
import ace from 'ace-builds/src-noconflict/ace';

// Import the modes/themes you want to support:
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-sql';

import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

export default {
  name: 'InputCodeEditor',
  mixins: [AposInputMixin],
  data() {
    return {
      editor: null
    };
  },
  computed: {
    current() {
      // AposInputMixin provides `next` as the editable value
      const v = this.next || {};
      return {
        code: typeof v.code === 'string' ? v.code : '',
        language: typeof v.language === 'string' ? v.language : (this.field.defaultLanguage || 'javascript')
      };
    },
    languageOptions() {
      const langs = this.field.languages || [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JSON', value: 'json' },
        { label: 'YAML', value: 'yaml' },
        { label: 'Markdown', value: 'markdown' },
        { label: 'Python', value: 'python' },
        { label: 'Shell', value: 'sh' },
        { label: 'SQL', value: 'sql' }
      ];
      return langs.map(l => ({ label: l.label || l.value, value: l.value || l }));
    }
  },
  mounted() {
    this.editor = ace.edit(this.$refs.editorEl);
    this.editor.setTheme(this.field.theme === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/tomorrow');
    this.editor.session.setMode(`ace/mode/${this.current.language}`);
    this.editor.session.setUseWorker(false); // avoids worker bundling headaches
    this.editor.setOptions({
      fontSize: this.field.fontSize || 13,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      wrap: true
    });

    this.editor.setValue(this.current.code, -1);

    this.editor.session.on('change', () => {
      this.next = {
        ...this.current,
        code: this.editor.getValue()
      };
    });
  },
  watch: {
    // If Apostrophe updates the field from outside (reset, etc.)
    current: {
      deep: true,
      handler(val) {
        if (!this.editor) return;
        if (this.editor.getValue() !== val.code) {
          this.editor.setValue(val.code, -1);
        }
        this.editor.session.setMode(`ace/mode/${val.language}`);
      }
    }
  },
  methods: {
    validate(value) {
      if (this.field.required && (!value || !value.code || !value.code.trim())) {
        return 'required';
      }
      return false;
    },
    onLanguageChange(language) {
      this.next = { ...this.current, language };
      if (this.editor) {
        this.editor.session.setMode(`ace/mode/${language}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap { display: grid; gap: 8px; }
.label { font-size: 12px; opacity: 0.8; }
.select { width: 220px; }
.editor {
  height: 320px;
  border: 1px solid var(--a-base-6);
  border-radius: 6px;
  overflow: hidden;
}
</style>
