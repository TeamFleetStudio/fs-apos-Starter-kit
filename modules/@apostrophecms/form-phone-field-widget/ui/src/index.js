import intlTelInput from 'intl-tel-input/build/js/intlTelInputWithUtils.js';

// Store intl-tel-input instances keyed by input element
const itiInstances = new WeakMap();
// Expose for cross-module access (form-widget validation)
window.__itiInstances = itiInstances;

function initPhoneFields() {
  const inputs = document.querySelectorAll('[data-apos-form-phone] input[type="tel"]:not([data-iti-init])');
  inputs.forEach((input) => {
    const defaultCountry = input.getAttribute('data-apos-phone-default-country') || 'in';
    // Preserve the custom placeholder set from CMS
    const customPlaceholder = input.getAttribute('placeholder');
    const iti = intlTelInput(input, {
      initialCountry: defaultCountry,
      countrySearch: true,
      nationalMode: false,
      formatOnDisplay: true,
      autoPlaceholder: 'off',
      countryOrder: ['in', 'us', 'gb', 'ae', 'au', 'sg']
    });
    // Restore the custom placeholder (intl-tel-input may clear it)
    if (customPlaceholder) {
      input.setAttribute('placeholder', customPlaceholder);
    }
    itiInstances.set(input, iti);
    input.setAttribute('data-iti-init', 'true');
  });
}

export default () => {
  // Initialize on page load
  initPhoneFields();

  // Re-initialize on any dynamic content (e.g., Apostrophe content refresh)
  if (window.apos && apos.bus) {
    apos.bus.$on('widget-rendered', () => {
      setTimeout(initPhoneFields, 100);
    });
  }

  apos.aposForm.collectors['@apostrophecms/form-phone-field'] = {
    selector: '[data-apos-form-phone]',
    collector(el) {
      const input = el.querySelector('input[type="tel"]');
      const fieldName = input.getAttribute('name');
      const iti = itiInstances.get(input);
      const value = iti ? iti.getNumber() : input.value;

      return {
        field: fieldName,
        value: value
      };
    }
  };
};
