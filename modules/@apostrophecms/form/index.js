const { PostHog } = require('posthog-node');
const areaConfig = require('../../../lib/area');
const axios = require('axios');
const nodemailer = require('nodemailer');

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
      },
      formIntegrations: {
        type: 'object',
        label: 'Form Integrations',
        fields: {
          add: {
            saveToPieceType: {
              type: 'string',
              label: 'Save Submissions to Piece Type',
              help: 'Enter the piece type name (e.g., contact-us-form, hero-form). Leave empty to skip saving.',
              def: ''
            },
            slack: {
              type: 'boolean',
              label: 'Send Slack Notification',
              def: false
            },
            slackWebhookUrl: {
              type: 'string',
              label: 'Slack Webhook URL',
              help: 'Get this from your Slack app settings',
              if: {
                'formIntegrations.slack': true
              }
            },
            slackMessageTemplate: {
              type: 'string',
              label: 'Slack Message Template',
              help: 'Use {{fieldName}} to insert form field values. Example: *New Form Submission*\\n\\nName: {{first-name}} {{last-name}}\\nEmail: {{email}}',
              textarea: true,
              if: {
                'formIntegrations.slack': true
              }
            },
            emailNotification: {
              type: 'boolean',
              label: 'Send Email Notification',
              def: false
            },
            emailRecipients: {
              type: 'array',
              label: 'Email Recipients',
              help: 'Email addresses to notify when form is submitted',
              fields: {
                add: {
                  email: {
                    type: 'string',
                    label: 'Email Address',
                    required: true
                  }
                }
              },
              if: {
                'formIntegrations.emailNotification': true
              }
            },
            emailSubject: {
              type: 'string',
              label: 'Email Subject',
              def: 'New Form Submission',
              if: {
                'formIntegrations.emailNotification': true
              }
            },
            externalApi: {
              type: 'boolean',
              label: 'Call External API',
              def: false
            },
            externalApiUrl: {
              type: 'string',
              label: 'External API URL',
              help: 'Full URL to POST form data to',
              if: {
                'formIntegrations.externalApi': true
              }
            },
            externalApiMethod: {
              type: 'select',
              label: 'HTTP Method',
              choices: [
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'PATCH', value: 'PATCH' }
              ],
              def: 'POST',
              if: {
                'formIntegrations.externalApi': true
              }
            }
          }
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
      },
      integrations: {
        label: 'Form Integrations',
        fields: ['formIntegrations']
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
        },
        async createFormSubmission(req, form, data) {
          try {
            const secret = self.options.recaptchaSecret || process.env.APOS_GOOGLE_RECAPTCHA_SECRET;
            const captchaEnabled = secret && form.enableRecaptcha !== false;

            if (captchaEnabled) {
              if (!req.recaptchaValidatedTokens) {
                req.recaptchaValidatedTokens = new Set();
              }
              
              let token = data.recaptchaToken || data.recaptcha;
              
              if (!token && req.body) {
                token = req.body.recaptchaToken || req.body.recaptcha;
                
                if (!token && req.body.data) {
                  try {
                    const bodyData = typeof req.body.data === 'string' 
                      ? JSON.parse(req.body.data) 
                      : req.body.data;
                    token = bodyData?.recaptchaToken || bodyData?.recaptcha;
                  } catch (e) {
                    // Silent error handling
                  }
                }
                
                if (token && !data.recaptchaToken) {
                  data.recaptchaToken = token;
                }
              }
              if (!token || !req.recaptchaValidatedTokens.has(token)) {
                const formErrors = [];
                const validationResult = await self.checkRecaptcha(req, data, formErrors, token);
                
                // Mark token as validated if validation succeeded
                if (validationResult && token) {
                  req.recaptchaValidatedTokens.add(token);
                }
                
                // Block submission if reCAPTCHA validation fails
                if (formErrors.length > 0) {
                  const error = new Error('reCAPTCHA validation failed');
                  error.formErrors = formErrors;
                  throw error;
                }
              }
            }

            let posthog;
            if (req.data.global.isPosthogEnabled) {
              posthog = new PostHog(req.data.global.posthogKey, { host: req.data.global.posthogHost });
            }

            // Process configurable form integrations (works for any form)
            if (form.formIntegrations) {
              await self.processFormIntegrations(req, form, data);
            }

            // Legacy handlers for backward compatibility (can be removed later)
            if (form.slug === 'contact-us-form' || form.slug === 'contact-us') {
              const slugTitle = `${data['first-name']}-${data['last-name']}`;
              const submissionData = {
                title: `${data['first-name']} ${data['last-name']}`,
                slug: slugTitle.replace(/\s+/g, '-').toLowerCase(),
                firstName: data['first-name'],
                lastName: data['last-name'],
                phoneNumber: data['phone-number'],
                jobTitle: data['job-title'],
                published: true,
                ...data
              };
              const url = `${process.env.APOS_BASE_URL}/api/v1/contact-us-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(url, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              const formData = {
                firstName: data['first-name'],
                lastName: data['last-name'],
                email: data.email,
                phoneNumber: data['phone-number'],
                company: data.company,
                jobTitle: data['job-title']
              };
              if (form.linkUrl) {
                const url = form.linkUrl;
                axios.post(url, formData)
                  .catch(function (error) {
                    console.error(error);
                  });
              }

              // Legacy Slack notification (only if not configured via formIntegrations)
              if (!form.formIntegrations?.slack) {
                const slackWebhookUrl = "https://hooks.slack.com/services/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";
                const slackMessage = {
                  text: `*New Contact Form Submission*\n\n Name: ${data['first-name']} ${data['last-name']}\n Email: ${data.email}\n Phone: ${data['phone-number']}\n Company: ${data.company}\n Job Title: ${data['job-title']}`
                };

                axios.post(slackWebhookUrl, slackMessage)
                  .catch((error) => console.error('Slack API error:', error));
              }

              req.session.message = 'Form submitted successfully';
            } 
            else if (form.slug === 'footer-form') {
              const submissionData = {
                title: data.email,
                email: data.email,
                published: true,
                ...data
              };
              const url = `${process.env.APOS_BASE_URL}/api/v1/footer-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(url, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              const formData = {
                email: data.email
              };
              if (form.linkUrl) {
                const url = form.linkUrl;
                axios.post(url, formData)
                  .catch(function (error) {
                    console.error(error);
                  });
              }
              req.session.message = 'Form submitted successfully';
            } else if (form.slug === 'whitepaper-form') {
              const slugTitle = `${data['first-name']}-${data['last-name']}`;
              const submissionData = {
                title: `${data['first-name']} ${data['last-name']}`,
                slug: slugTitle.replace(/\s+/g, '-').toLowerCase(),
                firstName: data['first-name'],
                lastName: data['last-name'],
                email: data.email,
                jobTitle: data['job-title'],
                published: true,
                ...data
              };
              const url = `${process.env.APOS_BASE_URL}/api/v1/whitepaper-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(url, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              const formData = {
                firstName: data['first-name'],
                lastName: data['last-name'],
                email: data.email,
                jobTitle: data['job-title']
              };
              if (form.linkUrl) {
                const url = form.linkUrl;
                axios.post(url, formData)
                  .catch(function (error) {
                    console.error(error);
                  });
              }
              req.session.message = 'Form submitted successfully';
            }
          } catch (error) {
            if (error.formErrors) {
              console.error('[reCAPTCHA Server] Form submission blocked:', error.message);
            }
            req.session.message = 'Submission failed';
            throw error;
          }
        }
      }
    };
  },
  methods(self) {
    return {
      // Helper to replace template variables in strings
      replaceTemplateVariables(template, data) {
        if (!template) return '';
        let result = template;
        // Replace {{fieldName}} with actual values
        Object.keys(data).forEach(key => {
          const value = Array.isArray(data[key]) 
            ? data[key].join(', ') 
            : (data[key] || 'Not provided');
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          result = result.replace(regex, String(value));
        });
        return result;
      },

      // Save form submission to a piece type
      async saveToPieceType(req, form, data, pieceTypeName) {
        if (!pieceTypeName) return;
        
        try {
          const pieceType = self.apos.modules[pieceTypeName];
          if (!pieceType) {
            console.warn(`Piece type "${pieceTypeName}" not found. Skipping save.`);
            return;
          }

          // Create a title from form data (try common fields)
          const title = data.title || 
                       data.email || 
                       `${data['first-name'] || ''} ${data['last-name'] || ''}`.trim() ||
                       `Form Submission ${Date.now()}`;

          // Create slug from title
          const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

                const submissionData = {
            title: title,
            slug: `${slug}-${Date.now()}`,
                  published: true,
                  ...data
                };

          const url = `${process.env.APOS_BASE_URL}/api/v1/${pieceTypeName}?apikey=${process.env.APOS_ADMIN_API_KEY}`;
                await axios.post(url, submissionData);
          console.log(`Form submission saved to ${pieceTypeName}`);
        } catch (error) {
          console.error(`Error saving to piece type ${pieceTypeName}:`, error);
        }
      },

      // Send Slack notification
      async sendSlackNotification(webhookUrl, messageTemplate, formData) {
        if (!webhookUrl) return;

        try {
          const message = self.replaceTemplateVariables(messageTemplate, formData);
          await axios.post(webhookUrl, { text: message });
          console.log('Slack notification sent');
        } catch (error) {
          console.error('Slack notification error:', error);
        }
      },

              // Send email notification
      async sendEmailNotification(recipients, subject, formData) {
        if (!recipients || recipients.length === 0) return;

              try {
                const transporter = nodemailer.createTransport({
                  host: process.env.SMTP_HOST || 'smtp.gmail.com',
                  port: parseInt(process.env.SMTP_PORT) || 587,
                  secure: process.env.SMTP_PORT === '465',
                  auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                  },
                });

          // Create simple HTML email with form data
          const formDataHtml = Object.keys(formData)
            .map(key => {
              const value = Array.isArray(formData[key]) 
                ? formData[key].join(', ') 
                : formData[key];
              return `<p><strong>${key}:</strong> ${value || 'Not provided'}</p>`;
            })
            .join('');

                const emailData = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: recipients.map(r => r.email).join(', '),
            subject: subject || 'New Form Submission',
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  h2 { color: #333; }
                        </style>
                    </head>
              <body>
                <div class="container">
                  <h2>New Form Submission</h2>
                  ${formDataHtml}
                </div>
                    </body>
                    </html>
                  `
                };

                await transporter.sendMail(emailData);
          console.log('Email notification sent');
        } catch (error) {
          console.error('Email notification error:', error);
        }
      },

      // Call external API
      async callExternalApi(apiUrl, method, formData) {
        if (!apiUrl) return;

        try {
          const config = {
            method: method || 'POST',
            url: apiUrl,
            data: formData,
            timeout: 15000
          };

          await axios(config);
          console.log('External API called successfully');
        } catch (error) {
          console.error('External API error:', error);
        }
      },

      // Process form integrations
      async processFormIntegrations(req, form, data) {
        const integrations = form.formIntegrations || {};

        // Save to piece type
        if (integrations.saveToPieceType) {
          await self.saveToPieceType(req, form, data, integrations.saveToPieceType);
        }

        // Send Slack notification
        if (integrations.slack && integrations.slackWebhookUrl && integrations.slackMessageTemplate) {
          await self.sendSlackNotification(
            integrations.slackWebhookUrl,
            integrations.slackMessageTemplate,
            data
          );
        }

        // Send email notification
        if (integrations.emailNotification && integrations.emailRecipients) {
          await self.sendEmailNotification(
            integrations.emailRecipients,
            integrations.emailSubject,
            data
          );
        }

        // Call external API
        if (integrations.externalApi && integrations.externalApiUrl) {
          await self.callExternalApi(
            integrations.externalApiUrl,
            integrations.externalApiMethod,
            data
          );
        }
      },
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

