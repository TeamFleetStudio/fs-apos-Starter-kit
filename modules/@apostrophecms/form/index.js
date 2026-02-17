const areaConfig = require('../../../lib/area');
const axios = require('axios');

module.exports = {
  options: {
    classPrefix: 'my-form',
    recaptchaSite: process.env.APOS_GOOGLE_RECAPTCHA_SITE_KEY,
    recaptchaSecret: process.env.APOS_GOOGLE_RECAPTCHA_SECRET,
    recaptchaThreshold: parseFloat(process.env.APOS_GOOGLE_RECAPTCHA_THRESHOLD) || 0.5,
    formWidgets: {
      '@apostrophecms/form-text-field': {},
      '@apostrophecms/form-textarea-field': {},
      '@apostrophecms/form-boolean-field': {},
      '@apostrophecms/form-select-field': {},
      '@apostrophecms/form-radio-field': {},
      '@apostrophecms/form-checkboxes-field': {},
      '@apostrophecms/form-conditional': {},
      ...areaConfig.richText
    }
  },
  fields: {
    add: {
      subscription: {
        type: 'boolean',
        label: 'Set as a subscription form',
        def: false
      },
      emailSubscriptionField: {
        label: 'Which is your subscription email field?',
        help: 'aposForm:confEmailFieldHelp',
        type: 'string',
        required: true,
        if: {
          subscription: true
        }
      },
      linkUrl: {
        label: 'URL for post link',
        type: 'url'
      },
      thankYouBody: {
        label: 'Thank You Body',
        type: 'area',
        options: {
          widgets: areaConfig.richText
        }
      }
    },
    group: {
      formRedirect: {
        label: 'Third Party Submission',
        fields: ['linkUrl']
      },
      subscription: {
        label: 'Enable Subscriptions',
        fields: ['subscription', 'emailSubscriptionField']
      }
    }
  },
  helpers(self) {
    return {
      prependIfPrefix(suffix) {
        const prefix = self.options.classPrefix || '';
        if (!prefix) {
          return suffix;
        }
        if (!suffix) {
          return prefix;
        }
        return `${prefix}${suffix}`;
      }
    };
  },
  handlers(self) {
    return {
      submission: {
        async subscription(req, form, data) {
          if (form.subscription === false) {
            return;
          }
          // Test email field has valid email
          // Email validation (Regex reference: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript)
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if (
            data[form.emailSubscriptionField] &&
            (typeof data[form.emailSubscriptionField] !== 'string' ||
              !re.test(data[form.emailSubscriptionField]))
          ) {
            await self.apos.notify(req, 'aposForm:errorEmailConfirm', {
              type: 'warning',
              icon: 'alert-circle-icon',
              interpolate: {
                field: form.emailSubscriptionField
              }
            });
            return null;
          }

          // Include subscription set up below
          try {
            self.apos.util.log('You need to set up a custom subscription service here');
            return null;
          } catch (err) {
            self.apos.util.error('@apostrophecms/form submission email subscription error: ', err);

            return null;
          }
        }
      }
    };
  },
  methods(self) {
    return {
      async checkRecaptcha(req, input, formErrors, tokenParam) {
        if (!req.recaptchaValidatedTokens) {
          req.recaptchaValidatedTokens = new Set();
        }

        const secret = self.options.recaptchaSecret || process.env.APOS_GOOGLE_RECAPTCHA_SECRET;
        const token = tokenParam || input.recaptchaToken || input.recaptcha;

        if (!secret || !token) {
          if (!token) {
            formErrors.push({
              global: true,
              error: 'recaptcha',
              message: req.t('aposForm:recaptchaSubmitError')
            });
          }
          return false;
        }

        // Check if token was already validated in this request BEFORE making API call
        if (token && req.recaptchaValidatedTokens.has(token)) {
          return true;
        }

        try {
          // Verify token with Google reCAPTCHA API
          const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
              params: {
                secret,
                response: token
              }
            }
          );

          const result = response.data;
          const threshold = self.options.recaptchaThreshold || 0.5;

          if (!result.success && result['error-codes'] && result['error-codes'].includes('timeout-or-duplicate')) {
            if (req.recaptchaValidatedTokens && req.recaptchaValidatedTokens.has(token)) {
              return true;
            }
            formErrors.push({
              global: true,
              error: 'recaptcha',
              message: req.t('aposForm:recaptchaValidationError')
            });
            return false;
          }

          // Check if verification succeeded and score meets threshold
          if (!result.success) {
            formErrors.push({
              global: true,
              error: 'recaptcha',
              message: req.t('aposForm:recaptchaValidationError')
            });
            return false;
          } else if (result.score !== undefined) {
            if (result.score < threshold) {
              formErrors.push({
                global: true,
                error: 'recaptcha',
                message: req.t('aposForm:recaptchaValidationError')
              });
              return false;
            }
          }

          if (!req.recaptchaValidatedTokens) {
            req.recaptchaValidatedTokens = new Set();
          }
          req.recaptchaValidatedTokens.add(token);
          return true;
        } catch (error) {
          self.apos.util.error('reCAPTCHA verification error', error);

          formErrors.push({
            global: true,
            error: 'recaptcha',
            message: req.t('aposForm:recaptchaConfigError')
          });
          return false;
        }
      }
    };
  }
};

