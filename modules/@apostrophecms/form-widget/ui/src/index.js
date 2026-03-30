export default () => {
  if (typeof apos === 'undefined' || !apos.util || !apos.util.widgetPlayers) {
    return;
  }

  const originalPlayer = apos.util.widgetPlayers['@apostrophecms/form'];
  if (!originalPlayer) {
    return;
  }

  const originalPlayerFn = originalPlayer.player;

  originalPlayer.player = function (el) {
    const result = originalPlayerFn.call(this, el);

    const form = el.querySelector('[data-apos-form-form]');
    if (!form) {
      return result;
    }

    // Client-side validation on submit — runs before the form module's own handler
    form.addEventListener('submit', function (e) {
      // Clear previous field errors
      const prevErrors = form.querySelectorAll('.apos-form-field-error.apos-form-error');
      prevErrors.forEach(function (msg) {
        msg.classList.remove('apos-form-error');
        msg.hidden = true;
        msg.textContent = '';
      });
      const prevInputErrors = form.querySelectorAll('.apos-form-input-error');
      prevInputErrors.forEach(function (inp) {
        inp.classList.remove('apos-form-input-error');
      });

      const requiredFields = form.querySelectorAll('[data-apos-required]');
      let hasError = false;
      const seen = new Set();

      requiredFields.forEach(function (field) {
        const name = field.getAttribute('name');
        if (!name || seen.has(name)) {
          return;
        }

        let isEmpty = false;
        const type = field.type;

        if (type === 'radio') {
          // All radios with this name — at least one must be checked
          const radios = form.querySelectorAll('[name="' + name + '"]');
          let checked = false;
          radios.forEach(function (r) { if (r.checked) { checked = true; } });
          isEmpty = !checked;
          seen.add(name);
        } else if (type === 'checkbox') {
          isEmpty = !field.checked;
        } else if (field.tagName === 'SELECT') {
          isEmpty = !field.value;
        } else {
          // Text, tel, email, textarea, file, etc.
          isEmpty = !field.value || !field.value.trim();
        }

        if (isEmpty) {
          hasError = true;
          seen.add(name);

          // Get custom error message or use default
          const customMsg = field.getAttribute('data-apos-error-message');
          const errorMsg = customMsg || 'This field is required';

          // Find the error span by field name
          const errorSpan = form.querySelector('[data-apos-input-message="' + name + '"]');
          if (errorSpan) {
            errorSpan.textContent = errorMsg;
            errorSpan.hidden = false;
            errorSpan.classList.add('apos-form-error');
          }

          // Mark the input with error class
          field.classList.add('apos-form-input-error');
        }
      });

      // --- Format validation: Email ---
      var emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(function (field) {
        var name = field.getAttribute('name');
        // Skip if already showing a required error
        if (name && !seen.has(name) || (seen.has(name) && !field.classList.contains('apos-form-input-error'))) {
          var val = field.value ? field.value.trim() : '';
          if (val) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
              hasError = true;
              var errorSpan = form.querySelector('[data-apos-input-message="' + name + '"]');
              if (errorSpan) {
                errorSpan.textContent = 'Please enter a valid email address';
                errorSpan.hidden = false;
                errorSpan.classList.add('apos-form-error');
              }
              field.classList.add('apos-form-input-error');
            }
          }
        }
      });

      // --- Format validation: Phone ---
      var phoneContainers = form.querySelectorAll('[data-apos-form-phone]');
      phoneContainers.forEach(function (container) {
        var input = container.querySelector('input[type="tel"]');
        if (!input) { return; }
        var name = input.getAttribute('name');
        // Skip if already showing a required error
        if (input.classList.contains('apos-form-input-error')) { return; }
        var val = input.value ? input.value.trim() : '';
        if (val) {
          var isValid = false;
          // Use intl-tel-input validation if available
          if (window.__itiInstances) {
            var iti = window.__itiInstances.get(input);
            if (iti) {
              isValid = iti.isValidNumber();
            }
          }
          if (!isValid) {
            hasError = true;
            var errorSpan = form.querySelector('[data-apos-input-message="' + name + '"]');
            if (errorSpan) {
              errorSpan.textContent = 'Please enter a valid phone number';
              errorSpan.hidden = false;
              errorSpan.classList.add('apos-form-error');
            }
            input.classList.add('apos-form-input-error');
          }
        }
      });

      if (hasError) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Scroll to first error
        const firstError = form.querySelector('.apos-form-field-error.apos-form-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, true); // useCapture so it fires before the form module's handler

    // Preserve form container height on successful submission
    const wrapper = el.querySelector('[data-apos-form-wrapper]');
    const thankYou = el.querySelector('[data-apos-form-thank-you]');
    if (wrapper && thankYou) {
      // Capture the wrapper height before submission
      let capturedHeight = 0;
      form.addEventListener('submit', function () {
        capturedHeight = wrapper.offsetHeight;
      }, true);

      // Watch for the thank-you message becoming visible
      const observer = new MutationObserver(function () {
        if (!thankYou.classList.contains('apos-form-hidden')) {
          if (capturedHeight) {
            wrapper.style.minHeight = capturedHeight + 'px';
          }
          wrapper.style.display = 'flex';
          wrapper.style.flexDirection = 'column';
          wrapper.style.justifyContent = 'center';
          wrapper.style.alignItems = 'center';
          observer.disconnect();
        }
      });
      observer.observe(thankYou, { attributes: true, attributeFilter: ['class'] });
    }

    const recaptchaSiteKey = form.getAttribute('data-apos-recaptcha-sitekey');
    if (recaptchaSiteKey) {
      form.addEventListener('submit', async function (e) {
        const recaptchaError = el.querySelector('[data-apos-form-recaptcha-error]');
        const tokenInput = form.querySelector('input[name="recaptchaToken"]');
        let token = tokenInput ? tokenInput.value : null;

        if (!token && window.grecaptcha) {
          try {
            token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit' });
            if (tokenInput) {
              tokenInput.value = token;
            }
          } catch (error) {
            // Silent error handling
          }
        }

        if (!token) {
          e.preventDefault();
          if (recaptchaError) {
            recaptchaError.classList.remove('apos-form-hidden');
            recaptchaError.style.display = 'block';
          }
          return false;
        }
      }, true);
    }

    return result;
  };
};
