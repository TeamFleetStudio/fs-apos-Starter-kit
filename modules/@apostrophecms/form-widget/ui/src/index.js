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
    // Use form.closest to find wrapper reliably (el might BE the wrapper itself)
    const wrapper = form.closest('[data-apos-form-wrapper]') || el.querySelector('[data-apos-form-wrapper]') || el;
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

    // --- Mobile Modal Mode ---
    // The modal container is a sibling of the form wrapper, so search from parent
    const widgetRoot = el.parentElement || el.closest('[data-apos-widget]') || document;
    const mobileModalContainer = widgetRoot.querySelector('[data-apos-mobile-modal]') || el.querySelector('[data-apos-mobile-modal]');
    if (mobileModalContainer) {
      const openBtn = mobileModalContainer.querySelector('[data-apos-mobile-modal-open]');
      const overlay = mobileModalContainer.querySelector('[data-apos-mobile-modal-overlay]');
      const closeBtn = mobileModalContainer.querySelector('[data-apos-mobile-modal-close]');
      const modalBody = mobileModalContainer.querySelector('[data-apos-mobile-modal-body]');

      // Move overlay to document.body so it's not clipped by any parent overflow/transform
      if (overlay && overlay.parentNode !== document.body) {
        document.body.appendChild(overlay);
      }

      function isMobile() {
        return window.innerWidth < 1024;
      }

      function openModal() {
        if (!isMobile()) return;
        // Move form wrapper into modal body
        if (wrapper && modalBody && !modalBody.contains(wrapper)) {
          modalBody.appendChild(wrapper);
          wrapper.style.display = '';
          wrapper.classList.remove('apos-form-desktop-only');
        }
        overlay.classList.add('apos-form-modal-open');
        document.body.style.overflow = 'hidden';
      }

      function closeModal() {
        overlay.classList.remove('apos-form-modal-open');
        document.body.style.overflow = '';
      }

      if (openBtn) {
        openBtn.addEventListener('click', openModal);
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }
      // Close on overlay background click
      if (overlay) {
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            closeModal();
          }
        });
      }
      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('apos-form-modal-open')) {
          closeModal();
        }
      });

      // On resize: move form back to original position if going to desktop
      function handleResize() {
        if (!isMobile() && modalBody && modalBody.contains(wrapper)) {
          // Move form wrapper back after the mobile modal container
          mobileModalContainer.parentNode.insertBefore(wrapper, mobileModalContainer.nextSibling);
          wrapper.classList.add('apos-form-desktop-only');
          closeModal();
        }
      }
      window.addEventListener('resize', handleResize);
    }

    return result;
  };
};
