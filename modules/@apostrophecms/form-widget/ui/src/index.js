export default () => {
  // Wait for the default form widget player to be registered
  if (typeof apos !== 'undefined' && apos.util && apos.util.widgetPlayers) {
    const originalPlayer = apos.util.widgetPlayers['@apostrophecms/form'];
    
    if (originalPlayer) {
      const originalPlayerFn = originalPlayer.player;
      
      originalPlayer.player = function(el) {
        const result = originalPlayerFn.call(this, el);
        
        const form = el.querySelector('[data-apos-form-form]');
        if (!form) {
          return result;
        }

        const recaptchaSiteKey = form.getAttribute('data-apos-recaptcha-sitekey');
        
        if (!recaptchaSiteKey) {
          return result;
        }

        const submitHandler = form.querySelector('[data-apos-form-submit]')?.closest('form');
        if (submitHandler) {
          const originalSubmit = form.onsubmit;
          
          form.addEventListener('submit', async function(e) {
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
    }
  }
};

