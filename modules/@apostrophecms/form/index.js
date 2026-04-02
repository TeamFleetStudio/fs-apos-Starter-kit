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
      '@apostrophecms/form-phone-field': {},
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
                slack: true
              }
            },
            slackMessageTemplate: {
              type: 'string',
              label: 'Slack Message Template',
              help: 'Use {{fieldName}} to insert form field values. Example: *New Form Submission*\\n\\nName: {{first-name}} {{last-name}}\\nEmail: {{email}}',
              textarea: true,
              if: {
                slack: true
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
                emailNotification: true
              }
            },
            emailSubject: {
              type: 'string',
              label: 'Email Subject',
              def: 'New Form Submission',
              if: {
                emailNotification: true
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
                externalApi: true
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
                externalApi: true
              }
            },
            externalApiFieldMapping: {
              type: 'array',
              label: 'Field Mapping',
              help: 'Map form field names to API field names. e.g., form field "full-name" → API field "full_name". Unmapped fields are excluded.',
              titleField: 'formField',
              fields: {
                add: {
                  formField: {
                    type: 'string',
                    label: 'Form Field Name',
                    help: 'The field name from your form (e.g., full-name, email, phone-number)',
                    required: true
                  },
                  apiField: {
                    type: 'string',
                    label: 'API Field Name',
                    help: 'The key the external API expects (e.g., full_name, email_address, phone_number)',
                    required: true
                  },
                  defaultValue: {
                    type: 'string',
                    label: 'Default Value (optional)',
                    help: 'If form field is empty or not present, send this value instead'
                  }
                }
              },
              if: {
                externalApi: true
              }
            },
            externalApiStaticFields: {
              type: 'array',
              label: 'Static Fields',
              help: 'Extra key-value pairs to always send with the API call (e.g., event_name, payment_status)',
              titleField: 'key',
              fields: {
                add: {
                  key: {
                    type: 'string',
                    label: 'Field Name',
                    required: true
                  },
                  value: {
                    type: 'string',
                    label: 'Value',
                    required: true
                  }
                }
              },
              if: {
                externalApi: true
              }
            },
            triggerPaymentModal: {
              type: 'boolean',
              label: 'Show Payment Modal on Successful Submission',
              help: 'Opens the payment modal (configured in Global Settings → Payment Modal) after a successful form submission.',
              def: false
            },

            // ─── Post-Payment Verification ───
            paymentVerifyUrl: {
              type: 'string',
              label: 'Payment Verification URL',
              help: 'Lambda/API URL that returns payment details when called with ?payment_id=xxx (e.g., AWS Lambda endpoint)',
              if: { triggerPaymentModal: true }
            },

            // ─── PocketBase Payment Sync ───
            pocketbaseSync: {
              type: 'boolean',
              label: 'Sync Payment Status to PocketBase',
              help: 'After payment verification, find the PocketBase record and update its payment fields.',
              def: false,
              if: { triggerPaymentModal: true }
            },
            pocketbaseBaseUrl: {
              type: 'string',
              label: 'PocketBase Base URL',
              help: 'e.g., https://fs-forms-api.fsgarage.in',
              if: { triggerPaymentModal: true, pocketbaseSync: true }
            },
            pocketbaseCollection: {
              type: 'string',
              label: 'PocketBase Collection Name',
              help: 'e.g., FSA_EVENTS',
              if: { triggerPaymentModal: true, pocketbaseSync: true }
            },
            pocketbaseMatchEmailField: {
              type: 'string',
              label: 'Email Field Name in PocketBase',
              help: 'Field used to find the record by email (e.g., email_address)',
              def: 'email_address',
              if: { triggerPaymentModal: true, pocketbaseSync: true }
            },
            pocketbaseMatchPhoneField: {
              type: 'string',
              label: 'Phone Field Name in PocketBase (Fallback)',
              help: 'If email match fails, try matching by phone (e.g., phone_number)',
              def: 'phone_number',
              if: { triggerPaymentModal: true, pocketbaseSync: true }
            },

            // ─── Interakt WhatsApp Notification ───
            interaktNotify: {
              type: 'boolean',
              label: 'Send WhatsApp Notification (Interakt)',
              help: 'Send a WhatsApp template message to the user after successful payment.',
              def: false,
              if: { triggerPaymentModal: true }
            },
            interaktApiKey: {
              type: 'string',
              label: 'Interakt API Key',
              help: 'Your Interakt Basic auth key',
              if: { triggerPaymentModal: true, interaktNotify: true }
            },
            interaktTemplateName: {
              type: 'string',
              label: 'WhatsApp Template Name',
              help: 'e.g., event_regsitration_thanks_2',
              if: { triggerPaymentModal: true, interaktNotify: true }
            },
            interaktTemplateLanguage: {
              type: 'string',
              label: 'Template Language Code',
              def: 'en',
              if: { triggerPaymentModal: true, interaktNotify: true }
            },
            interaktNameField: {
              type: 'string',
              label: 'PocketBase Field for User Name',
              help: 'PocketBase field name for the user\'s name (e.g., full_name)',
              def: 'full_name',
              if: { triggerPaymentModal: true, interaktNotify: true }
            },
            interaktPhoneField: {
              type: 'string',
              label: 'PocketBase Field for Phone',
              help: 'PocketBase field name for the user\'s phone (e.g., phone_number)',
              def: 'phone_number',
              if: { triggerPaymentModal: true, interaktNotify: true }
            },
            interaktBodyValues: {
              type: 'array',
              label: 'Template Body Values (in order)',
              help: 'Values passed to the WhatsApp template. Use "pb:field_name" for PocketBase record fields, or enter static text.',
              titleField: 'value',
              fields: {
                add: {
                  value: {
                    type: 'string',
                    label: 'Value',
                    help: 'e.g., "pb:full_name" or "pb:event_name" or "Mar 21, 2026 | 11AM-1PM IST"',
                    required: true
                  }
                }
              },
              if: { triggerPaymentModal: true, interaktNotify: true }
            },

            // ─── Brevo CRM Sync ───
            brevoSync: {
              type: 'boolean',
              label: 'Sync to Brevo CRM',
              help: 'Create or update a Brevo contact after successful payment.',
              def: false,
              if: { triggerPaymentModal: true }
            },
            brevoApiKey: {
              type: 'string',
              label: 'Brevo API Key',
              if: { triggerPaymentModal: true, brevoSync: true }
            },
            brevoFormType: {
              type: 'select',
              label: 'Brevo Form Type',
              help: 'Determines which program label to use in Brevo',
              choices: [
                { label: 'Event', value: 'event' },
                { label: 'Hire from us', value: 'hire' },
                { label: 'RAD Fellowship', value: 'rad' },
                { label: 'Ebook', value: 'ebook' },
                { label: 'Institution', value: 'institution' },
                { label: 'Corporate', value: 'corporate' }
              ],
              def: 'event',
              if: { triggerPaymentModal: true, brevoSync: true }
            },
            brevoListId: {
              type: 'integer',
              label: 'Brevo List ID',
              help: 'The Brevo contact list ID to add the contact to (e.g., 153 for Events)',
              if: { triggerPaymentModal: true, brevoSync: true }
            },
            brevoFieldMapping: {
              type: 'array',
              label: 'Brevo Field Mapping',
              help: 'Map PocketBase fields to Brevo contact attributes. Use "pb:field_name" for PocketBase fields or static text.',
              titleField: 'brevoAttribute',
              fields: {
                add: {
                  brevoAttribute: {
                    type: 'string',
                    label: 'Brevo Attribute Name',
                    help: 'e.g., FIRSTNAME, EVENT_NAME, COMPANYNAME, JOBTITLE',
                    required: true
                  },
                  sourceValue: {
                    type: 'string',
                    label: 'Value Source',
                    help: 'Use "pb:field_name" for PocketBase field (e.g., pb:full_name) or enter static text (e.g., PAID)',
                    required: true
                  }
                }
              },
              if: { triggerPaymentModal: true, brevoSync: true }
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
        // Use provided webhook URL or fallback to environment variable
        const slackWebhookUrl = webhookUrl || process.env.APOS_SLACK_WEBHOOK_URL;
        
        if (!slackWebhookUrl) {
          console.warn('Slack notification skipped: No webhook URL provided and APOS_SLACK_WEBHOOK_URL not set');
          return;
        }

        try {
          const message = messageTemplate 
            ? self.replaceTemplateVariables(messageTemplate, formData)
            : `*New Form Submission*\n\n${JSON.stringify(formData, null, 2)}`;
          await axios.post(slackWebhookUrl, { text: message });
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

      // Call external API with optional field mapping
      async callExternalApi(apiUrl, method, formData, fieldMapping, staticFields) {
        if (!apiUrl) return;

        try {
          let payload;

          if (fieldMapping && fieldMapping.length > 0) {
            // Only include mapped fields with renamed keys
            payload = {};
            for (const mapping of fieldMapping) {
              const value = formData[mapping.formField];
              payload[mapping.apiField] = (value !== undefined && value !== null && value !== '')
                ? value
                : (mapping.defaultValue || '');
            }
          } else {
            // No mapping — send raw form data
            payload = { ...formData };
          }

          // Merge static fields (always override)
          if (staticFields && staticFields.length > 0) {
            for (const field of staticFields) {
              payload[field.key] = field.value;
            }
          }

          const config = {
            method: method || 'POST',
            url: apiUrl,
            data: payload,
            timeout: 15000
          };

          await axios(config);
          console.log('External API called successfully');
        } catch (error) {
          console.error('External API error:', error?.response?.data || error.message);
        }
      },

      // ─── Post-Payment: Resolve "pb:field_name" references from a PocketBase record ───
      resolveValue(source, pbRecord) {
        if (!source) return '';
        if (source.startsWith('pb:')) {
          const field = source.slice(3);
          const val = pbRecord[field];
          return val !== undefined && val !== null ? String(val) : '';
        }
        return source;
      },

      // ─── Post-Payment: Sync payment status to PocketBase ───
      async syncPocketBasePayment(integrations, payment) {
        const baseUrl = integrations.pocketbaseBaseUrl;
        const collection = integrations.pocketbaseCollection;
        const emailField = integrations.pocketbaseMatchEmailField || 'email_address';
        const phoneField = integrations.pocketbaseMatchPhoneField || 'phone_number';

        if (!baseUrl || !collection) return null;

        try {
          let record = null;

          // 1) Try to match by email
          if (payment.email) {
            const emailRes = await axios.get(
              `${baseUrl}/api/collections/${encodeURIComponent(collection)}/records`,
              {
                params: {
                  filter: `${emailField} = "${payment.email}"`,
                  sort: '-created',
                  perPage: 1
                },
                timeout: 10000
              }
            );
            if (emailRes.data.items && emailRes.data.items.length > 0) {
              record = emailRes.data.items[0];
            }
          }

          // 2) Fallback: match by phone
          if (!record && payment.contact) {
            const normalizedContact = String(payment.contact).replace(/[^\d]/g, '');
            if (normalizedContact) {
              const phoneRes = await axios.get(
                `${baseUrl}/api/collections/${encodeURIComponent(collection)}/records`,
                {
                  params: {
                    filter: `${phoneField} = "${normalizedContact}"`,
                    sort: '-created',
                    perPage: 1
                  },
                  timeout: 10000
                }
              );
              if (phoneRes.data.items && phoneRes.data.items.length > 0) {
                record = phoneRes.data.items[0];
              }
            }
          }

          if (!record) {
            console.error('PocketBase sync: No record found for email/phone');
            return null;
          }

          // Determine payment status string
          const status = payment.status === 'captured' ? 'success'
            : payment.status === 'failed' ? 'failed'
            : 'pending';

          // Update the record
          const updated = await axios.patch(
            `${baseUrl}/api/collections/${encodeURIComponent(collection)}/records/${record.id}`,
            {
              payment_status: status,
              razorpay_payment_id: payment.id || '',
              razorpay_order_id: payment.order_id || '',
              razorpay_payment_amount: payment.amount || 0,
              razorpay_signature: '',
              razorpay_payment_error_description: payment.error_description || ''
            },
            { timeout: 10000 }
          );

          console.log('PocketBase payment sync successful:', record.id);
          return updated.data;
        } catch (error) {
          console.error('PocketBase sync error:', error?.response?.data || error.message);
          return null;
        }
      },

      // ─── Post-Payment: Send Interakt WhatsApp notification ───
      async sendInteraktNotification(integrations, pbRecord) {
        const apiKey = integrations.interaktApiKey;
        const templateName = integrations.interaktTemplateName;
        const templateLanguage = integrations.interaktTemplateLanguage || 'en';
        const nameField = integrations.interaktNameField || 'full_name';
        const phoneField = integrations.interaktPhoneField || 'phone_number';

        if (!apiKey || !templateName) return;

        const name = pbRecord[nameField] || '';
        const phoneRaw = String(pbRecord[phoneField] || '');
        const phoneDigits = phoneRaw.replace(/[\s\-()+']+/g, '');
        const countryCode = phoneDigits.startsWith('91') ? '91' : phoneDigits.slice(0, 2);
        const phoneNumber = phoneDigits.startsWith(countryCode)
          ? phoneDigits.slice(countryCode.length)
          : phoneDigits;

        if (!phoneNumber) {
          console.warn('Interakt: No phone number found, skipping');
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Basic ${apiKey}`
        };

        try {
          // Track user
          await axios.post('https://api.interakt.ai/v1/public/track/users/', {
            userId: phoneNumber,
            phoneNumber,
            countryCode: `+${countryCode}`,
            traits: { name }
          }, { headers, timeout: 10000 });

          // Build body values from config
          const bodyValues = (integrations.interaktBodyValues || []).map(
            item => self.resolveValue(item.value, pbRecord)
          );

          // Send template message
          await axios.post('https://api.interakt.ai/v1/public/message/', {
            countryCode: `+${countryCode}`,
            phoneNumber,
            callbackData: 'event_registration',
            type: 'Template',
            template: {
              name: templateName,
              languageCode: templateLanguage,
              bodyValues
            }
          }, { headers, timeout: 10000 });

          console.log('Interakt WhatsApp notification sent');
        } catch (error) {
          console.error('Interakt error:', error?.response?.data || error.message);
        }
      },

      // ─── Post-Payment: Sync contact to Brevo CRM ───
      async syncBrevoContact(integrations, pbRecord, payment) {
        const apiKey = integrations.brevoApiKey;
        const formType = integrations.brevoFormType || 'event';
        const listId = integrations.brevoListId;
        const fieldMapping = integrations.brevoFieldMapping || [];

        if (!apiKey) return;

        const PROGRAM_LABELS = {
          hire: 'Hire from us',
          rad: 'RAD Fellowship',
          ebook: 'Ebook',
          event: 'Events',
          institution: 'Institution',
          corporate: 'RAD Pioneer Program'
        };

        const programLabel = PROGRAM_LABELS[formType] || formType;

        const brevoHeaders = {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        };

        const brevoBase = 'https://api.brevo.com/v3';

        // Resolve email from PocketBase record (try common field names)
        const email = pbRecord.email_address || pbRecord.email || payment.email;
        if (!email) {
          console.warn('Brevo sync: No email found, skipping');
          return;
        }

        try {
          // Build attributes from field mapping
          const attributes = {
            LAST_ACTIVITY_DATE: new Date().toISOString().split('T')[0]
          };

          for (const mapping of fieldMapping) {
            const val = self.resolveValue(mapping.sourceValue, pbRecord);
            if (val) {
              attributes[mapping.brevoAttribute] = val;
            }
          }

          // Always set program label
          attributes.FSA_PROGRAM = [programLabel];

          // Check if contact exists
          let existing = null;
          try {
            const contactRes = await axios.get(
              `${brevoBase}/contacts/${encodeURIComponent(email)}`,
              { headers: brevoHeaders, timeout: 10000 }
            );
            existing = contactRes.data;
          } catch (e) {
            if (e.response && e.response.status === 404) {
              existing = null;
            } else {
              throw e;
            }
          }

          if (!existing) {
            // Create new contact
            await axios.post(`${brevoBase}/contacts`, {
              email,
              attributes,
              listIds: listId ? [listId] : [],
              updateEnabled: false
            }, { headers: brevoHeaders, timeout: 10000 });
            console.log('Brevo contact created:', email);
          } else {
            // Merge multi-choice attributes
            const currentAttrs = existing.attributes || {};
            if (currentAttrs.FSA_PROGRAM) {
              const currentPrograms = Array.isArray(currentAttrs.FSA_PROGRAM)
                ? currentAttrs.FSA_PROGRAM
                : (typeof currentAttrs.FSA_PROGRAM === 'string'
                  ? currentAttrs.FSA_PROGRAM.split(',').map(s => s.trim()).filter(Boolean)
                  : []);
              if (!currentPrograms.some(v => v.toLowerCase() === programLabel.toLowerCase())) {
                currentPrograms.push(programLabel);
              }
              attributes.FSA_PROGRAM = currentPrograms;
            }

            // Update contact
            await axios.put(
              `${brevoBase}/contacts/${encodeURIComponent(email)}`,
              { attributes },
              { headers: brevoHeaders, timeout: 10000 }
            );
            console.log('Brevo contact updated:', email);

            // Add to list if not a member
            if (listId) {
              const currentLists = existing.listIds || [];
              if (!currentLists.includes(listId)) {
                await axios.post(
                  `${brevoBase}/contacts/lists/${listId}/contacts/add`,
                  { emails: [email] },
                  { headers: brevoHeaders, timeout: 10000 }
                );
                console.log('Brevo contact added to list:', listId);
              }
            }
          }
        } catch (error) {
          console.error('Brevo sync error:', error?.response?.data || error.message);
        }
      },

      // Process form integrations
      async processFormIntegrations(req, form, data) {
        const integrations = form.formIntegrations || {};

        // Save to piece type
        if (integrations.saveToPieceType) {
          await self.saveToPieceType(req, form, data, integrations.saveToPieceType);
        }

        // Send Slack notification (use env fallback if webhook URL not provided)
        if (integrations.slack) {
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
            data,
            integrations.externalApiFieldMapping,
            integrations.externalApiStaticFields
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
  },
  apiRoutes(self) {
    return {
      post: {
        async verifyPayment(req) {
          const { payment_id, formId } = req.body;

          if (!payment_id || !formId) {
            throw self.apos.error('invalid', 'Missing payment_id or formId');
          }

          // Fetch form document (use admin req to bypass permissions)
          const adminReq = self.apos.task.getReq();
          const form = await self.find(adminReq, { _id: formId }).toObject();
          if (!form) {
            throw self.apos.error('notfound', 'Form not found');
          }

          const integrations = form.formIntegrations || {};

          // 1) Call Lambda/API to get payment details
          let payment = null;
          if (integrations.paymentVerifyUrl) {
            try {
              const lambdaRes = await axios.get(integrations.paymentVerifyUrl, {
                params: { payment_id },
                timeout: 15000
              });
              payment = lambdaRes.data;
            } catch (error) {
              console.error('Payment verification error:', error?.response?.data || error.message);
              throw self.apos.error('invalid', 'Failed to fetch payment details');
            }
          }

          if (!payment) {
            throw self.apos.error('invalid', 'No payment data returned');
          }

          // 2) Sync payment to PocketBase
          let pbRecord = null;
          if (integrations.pocketbaseSync) {
            pbRecord = await self.syncPocketBasePayment(integrations, payment);
          }

          // Use payment data as fallback if PocketBase sync is disabled or no record found
          const record = pbRecord || payment;

          // 3) Send Interakt WhatsApp notification
          if (integrations.interaktNotify && record) {
            // Fire-and-forget: don't block response
            self.sendInteraktNotification(integrations, record).catch(err => {
              console.error('Interakt notification failed:', err.message);
            });
          }

          // 4) Sync to Brevo CRM
          if (integrations.brevoSync && record) {
            // Fire-and-forget: don't block response
            self.syncBrevoContact(integrations, record, payment).catch(err => {
              console.error('Brevo sync failed:', err.message);
            });
          }

          return {
            success: true,
            record: pbRecord
          };
        }
      }
    };
  }
};

