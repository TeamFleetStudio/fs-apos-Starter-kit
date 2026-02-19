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
            if (form.slug === 'contact-us') {
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

              // Send Slack Notification
              const slackWebhookUrl = "https://hooks.slack.com/services/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";
              const slackMessage = {
                text: `*New WallyAX Contact Form Submission*\n\n Name: ${data['first-name']} ${data['last-name']}\n Email: ${data.email}\n Phone: ${data['phone-number']}\n Company: ${data.company}\n Job Title: ${data['job-title']}`
              };

              axios.post(slackWebhookUrl, slackMessage)
                .catch((error) => console.error('Slack API error:', error));

              req.session.message = 'Form submitted successfully';
            } 
            else if (form.slug === 'tools-form') {
              const slugTitle = `${data['first-name']}-${data['last-name']}`;
              const submissionData = {
                title: `${data['first-name']} ${data['last-name']}`,
                slug: slugTitle.replace(/\s+/g, '-').toLowerCase(),
                firstName: data['first-name'],
                lastName: data['last-name'],
                phoneNumber: data['phone-number'],
                email: data['email'],
                company: data['your-company'],
                jobTitle: data['job-title'],
                published: true,
                ...data
              };
              const url = `${process.env.APOS_BASE_URL}/api/v1/tools-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(url, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              const formData = {
                firstName: data['first-name'],
                lastName: data['last-name'],
                email: data.email,
                phoneNumber: data['phone-number'],
                company: data['your-company'],
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
            } else if (form.slug === 'about-wally-form' || form.slug === 'report-form') {
              const submissionData = {
                title: data['email-address'],
                email: data['email-address'],
                websiteUrl: data['website-url'],
                published: true,
                ...data
              };
              const url = `${process.env.APOS_BASE_URL}/api/v1/about-wally-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(url, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              const formData = {
                email: data['email-address'],
                url: data['website-url']
              };
              if (form.linkUrl) {
                const url = form.linkUrl;
                axios.post(url, formData)
                  .catch(function (error) {
                    console.error(error);
                  });
              }
              if (req.data.global.isPosthogEnabled) {
                posthog.capture({
                  distinctId: formData.email,
                  event: 'Free Accessibility Report Form Submitted',
                  properties: {
                    email: formData.email,
                    websiteurl: formData.url,
                    $current_url: process.env.APOS_BASE_URL
                  }
                });
              }

              const slackWebhookUrl = "https://hooks.slack.com/services/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";
              const slackMessage = {
                text: `*New WallyAX Report Form Submission*\n\n Email: ${data['email-address']}\n Website URL: ${data['website-url']}`
              };

              axios.post(slackWebhookUrl, slackMessage)
                .catch((error) => console.error('Slack API error:', error));
              req.session.message = 'Form submitted successfully';
            }
            else if (form.slug === 'acr-form') {
              try {
                // First, validate wally-acr API call - if this fails, stop everything
                let vpatDownloadUrl = null;
                if (form.linkUrl) {
                  const formData = {
                    'name-of-product': data['name-of-product'],
                    'report-date': data['report-date'],
                    'product-description': data['product-description'],
                    'applicable-laws-acts': data['applicable-laws-acts'] || [],
                    'other-law-1': data['other-law-1'] || '',
                    'other-law-2': data['other-law-2'] || '',
                    'assistive-technologies': data['assistive-technologies'] || [],
                    'other-technologies': data['other-technologies'] || '',
                    'choose-for-me-technology': data['choose-for-me-technology'],
                    'automated-audit-tools': data['automated-audit-tools'] || [],
                    'other-tools': data['other-tools'] || '',
                    'choose-for-me-tools': data['choose-for-me-tools'],
                    'contact-information-email': data['contact-information-email']
                  };
                  const url = form.linkUrl + '/wally-acr';
                  
                  try {
                    const response = await axios.post(url, formData);
                    if (response.data && response.data.success && response.data.s3_upload && response.data.s3_upload.success) {
                      vpatDownloadUrl = response.data.s3_upload.url;
                    } else {
                      // If wally-acr API doesn't return success, throw error
                      throw new Error('Wally-ACR API failed to generate report');
                    }
                  } catch (error) {
                    console.error('Error calling wally-acr API:', error);
                    // Throw error to be caught by frontend
                    throw new Error('VPAT Form submission failed: Unable to generate accessibility report. Please try again later.');
                  }
                }

                // Only proceed with form submission if wally-acr API succeeds
                const submissionData = {
                  title: data['name-of-product'] || 'VPAT Form Submission',
                  slug: `acr-form-${Date.now()}`,
                  nameOfProductVersion: data['name-of-product'],
                  reportDate: data['report-date'],
                  productDescription: data['product-description'],
                  applicableLawsActs: data['applicable-laws-acts'] || [],
                  otherLaw1: data['other-law-1'] || '',
                  otherLaw2: data['other-law-2'] || '',
                  assistiveTechnologies: data['assistive-technologies'] || [],
                  otherTechnologies: data['other-technologies'] || '',
                  chooseForMeTechnology: data['choose-for-me-technology'],
                  automatedAuditTools: data['automated-audit-tools'] || [],
                  otherTools: data['other-tools'] || '',
                  chooseForMeTools: data['choose-for-me-tools'],
                  contactInformationEmail: data['contact-information-email'],
                  published: true,
                  ...data
                };
                const url = `${process.env.APOS_BASE_URL}/api/v1/acr-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
                await axios.post(url, submissionData);

              // Send email notification
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

                const emailData = {
                  from: "support@wallyax.com",
                  to: `${data['contact-information-email']}`,
                  subject: 'Your VPAT is ready',
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #eaf0f6;
                            }
                            .download-button {
                                display: inline-block;
                                background-color: #FED600;
                                color: black !important;
                                padding: 12px 24px;
                                text-decoration: none;
                                border-radius: 5px;
                                margin: 20px 0;
                                font-weight: bold;
                                font-size: 16px;
                            }
                            .download-button:hover {
                                background-color: #e6c200;
                                color: black !important;
                            }
                            .download-button:visited {
                                color: black !important;
                            }
                            .download-button:link {
                                color: black !important;
                            }
                        </style>
                    </head>
                    <body style="background-color: #eaf0f6; margin: 0; padding: 0;">
                        <!-- Header -->
                        <table style="width:100%;max-width:600px;margin:10px auto 30px auto;background-color:transparent;border-spacing:0">
                            <tr>
                                <td style="font-family:Arial,sans-serif;color:#000000;word-break:break-word;background-color:#fed600;padding:16px;padding-top:26px;padding-bottom:0;text-align:left;font-size:14px;font-weight:500;border-radius:8px" bgcolor="#FED600" align="left">
                                    <table width="100%">
                                        <tr>
                                            <td align="left" style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word">
                                                <img src="https://wally-cdn.s3.us-east-2.amazonaws.com/wally-logo.png" style="outline:none;text-decoration:none;height:40px" height="40">
                                            </td>
                                            <td align="right" style="font-family:Arial,sans-serif;word-break:break-word;font-size:14px;color:black">Accessibility to the core</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Content -->
                        <table style="width:100%;max-width:600px;margin:30px auto;background-color:transparent;box-sizing:border-box;padding-left:10px;padding-right:10px">
                            <tr>
                                <td style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;padding:20px 25px;background-color:white;border-radius:8px" bgcolor="white">
                                    <h2 style="font-size:18px;color:#000;font-weight:bold;margin-bottom:15px;margin-top:0;">Your VPAT Report is Ready</h2>
                                    
                                    <p style="font-size:16px;color:#000;font-weight:normal;margin-bottom:10px;margin-top:10px;line-height:1.5rem">
                                        You've already taken the first step by generating your preliminary VPAT®.
                                    </p>
                                    
                                    <p style="font-size:16px;color:#000;font-weight:normal;margin-bottom:10px;margin-top:10px;line-height:1.5rem">
                                        A Voluntary Product Accessibility Template (VPAT®) outlines the applicable accessibility standards and checks, and helps communicate your product's accessibility to clients, partners, and procurement teams.
                                    </p>
                                    
                                    <p style="font-size:16px;color:#000;font-weight:normal;margin-bottom:10px;margin-top:10px;line-height:1.5rem">
                                        <strong>Our 30 day ACR sprint</strong> helps you to create a comprehensive Accessibility Conformance Report (ACR) that:
                                    </p>
                                    
                                    <ul style="font-size:16px;color:#000;margin:15px 0;padding-left:20px;">
                                        <li style="margin:8px 0; color: #000;">Aligns with WCAG 2.2 Level AA standards</li>
                                        <li style="margin:8px 0; color: #000;">Incorporates comprehensive manual and assistive technology evaluations for reliable conformance</li>
                                        <li style="margin:8px 0; color: #000;">Is ready to share with customers, partners, or RFPs</li>
                                    </ul>
                                    
                                    <p style="font-size:16px;color:#000;font-weight:normal;margin-bottom:10px;margin-top:10px;line-height:1.5rem">
                                        We'll guide you though every step, from detailed audits to expert validation, ensuring your final report accurately represents your product's accessibility
                                    </p>
                                    
                                     ${vpatDownloadUrl ? `
                                     <p style="text-align: center; margin: 20px 0;">
                                         <a href="${vpatDownloadUrl}" class="download-button">DOWNLOAD YOUR VPAT®</a>
                                     </p>
                                     ` : ''}
                                    
                                    <p style="font-size:16px;color:#000;font-weight:normal;margin-bottom:10px;margin-top:10px;line-height:1.5rem">
                                        Let's review your report together and outline the best next steps in a <a href="https://calendly.com/vmoola" style="text-decoration: underline;">brief call</a>.
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Social Icons -->
                        <table role="presentation" align="center" style="width:auto;text-align:center;margin:0 auto">
                            <tr>
                                <td align="center" style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;padding:8px 5px;line-height:1;vertical-align:middle" valign="middle">
                                    <a href="https://linkedin.com/company/wallyax" style="color:#00a4bd;text-decoration:none!important" target="_blank">
                                        <img src="https://fjemnvq.stripocdn.email/content/assets/img/social-icons/logo-black/linkedin-logo-black.png" alt="LinkedIn" height="25" style="outline:none;text-decoration:none;border:none;width:auto!important;height:25px!important;vertical-align:middle" valign="middle" width="auto">
                                    </a>
                                </td>
                                <td align="center" style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;padding:8px 5px;line-height:1;vertical-align:middle" valign="middle">
                                    <a href="https://twitter.com/wallyax" style="color:#00a4bd;text-decoration:none!important" target="_blank">
                                        <img src="https://fjemnvq.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" height="25" style="outline:none;text-decoration:none;border:none;width:auto!important;height:25px!important;vertical-align:middle" valign="middle" width="auto">
                                    </a>
                                </td>
                                <td align="center" style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;padding:8px 5px;line-height:1;vertical-align:middle" valign="middle">
                                    <a href="https://wallyax.com" style="color:#00a4bd;text-decoration:none!important" target="_blank">
                                        <img src="https://ci3.googleusercontent.com/meips/ADKq_NZ1jgUDkRO9Dtrn9zoMr41ZL34WT2nKkqcU4Qx1XNPjpj6Iprx4g7C886hLMij1iLpccKVZrMtX7_xaClldrsNYKlvK6IoJXrmolZdm4U88gkfBAV7syd-lMYThJ6g4V8ik5F70labGEd1cXqpGii6UhLQRLnc43Kk6hHKV1zNpkPVpYedah2AjyUMwEROLKePVOm6fSEZZQ_Jb-HUP9Bqxro8O406ZdFMU3TBZhA=s0-d-e1-ft#https://mail-hs.wallyax.com/hs/hsstatic/TemplateAssets/static-1.262/img/hs_default_template_images/modules/Follow+Me+-+Email/website_original_black.png" alt="Website" height="25" style="outline:none;text-decoration:none;border:none;width:auto!important;height:25px!important;vertical-align:middle" valign="middle" width="auto" class="CToWUd" data-bit="iit">
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Company Address -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:12px;line-height:135%;color:#23496d;margin-bottom:0;padding:0">
                            <tr>
                                <td align="center" valign="top" style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;text-align:center;margin-bottom:0;line-height:135%;padding:10px 20px">
                                    <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:normal;text-decoration:none;font-style:normal;color:#000000">
                                        Wally Solutions Inc, 100 Nassau St, 2nd floor, Princeton, New Jersey 08542
                                    </p>
                                    <p>
                                        <a href="#" style="font-family:helvetica;font-size:12px;color:#00a4bd;font-weight:normal;text-decoration:underline;font-style:normal" target="_blank">Unsubscribe</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Copyright -->
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="font-family:Arial,sans-serif;font-size:15px;color:#000000;word-break:break-word;padding:5px 20px">
                                    <p style="text-align:center;font-size:12px;line-height:175%" align="center">©2025 Wally Ax. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                  `
                };

                await transporter.sendMail(emailData);

                // Send additional email to support@wallyax.com with the same template
                const additionalEmailData = {
                  from: "no-reply@wallyax.com",
                  to: "support@wallyax.com",
                  subject: 'New VPAT Form Submission - WallyAX',
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>New VPAT Form Submission</title>
                      <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    </head>
                    <body style="font-family: 'Mukta', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
                      <table class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-spacing: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td class="header" style="background-color: #FED600; padding: 16px; text-align: left; font-size: 14px; font-weight: 500; border-radius: 8px;">
                            <table width="100%">
                              <tr>
                                <td align="left">
                                  <img src="https://wally-cdn.s3.us-east-2.amazonaws.com/wally-logo.png" style="height: 40px;" />
                                </td>
                                <td class="header-wordings" align="right" style="font-size: 14px; color: black;">Accessibility to the core</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 30px;">
                              <h2 style="color: #000;">New VPAT Form Submission</h2>
                            <p style="color: #000;">WallyAX Accessibility Compliance Report</p>
                            
                            <div>
                              <h3>Product Information</h3>
                              <p><strong>Product Name:</strong><br>
                                <span style="display: inline-block; width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; background-color: #f9f9f9;">${data['name-of-product'] || 'Not provided'}</span>
                              </p>
                              <p><strong>Report Date:</strong><br>
                                <span style="display: inline-block; width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; background-color: #f9f9f9;">${data['report-date'] || 'Not provided'}</span>
                              </p>
                              <p><strong>Product Description:</strong><br>
                                <span style="display: inline-block; width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; background-color: #f9f9f9; min-height: 40px;">${data['product-description'] || 'Not provided'}</span>
                              </p>
                              <p><strong>Business Email:</strong><br>
                                <span>${data['contact-information-email'] || 'Not provided'}</span>
                              </p>
                            </div>
                            
                            <div style="color: #000;">
                              <p><strong>Applicable Laws/Acts:</strong><br>
                                ${(data['applicable-laws-acts'] || []).length > 0 
                                  ? '<ul style="margin: 5px 0; padding-left: 20px;">' + (data['applicable-laws-acts'] || []).map(law => `<li>${law}</li>`).join('') + '</ul>'
                                  : '<p style="color: #999; font-style: italic; margin: 5px 0;">None selected</p>'
                                }
                              </p>
                              <p><strong>Assistive Technologies:</strong><br>
                                ${(data['assistive-technologies'] || []).length > 0 
                                  ? '<ul style="margin: 5px 0; padding-left: 20px;">' + (data['assistive-technologies'] || []).map(tech => `<li>${tech}</li>`).join('') + '</ul>'
                                  : '<p style="color: #999; font-style: italic; margin: 5px 0;">None selected</p>'
                                }
                              </p>
                              <p><strong>Automated Audit Tools:</strong><br>
                                ${(data['automated-audit-tools'] || []).length > 0 
                                  ? '<ul style="margin: 5px 0; padding-left: 20px;">' + (data['automated-audit-tools'] || []).map(tool => `<li>${tool}</li>`).join('') + '</ul>'
                                  : '<p style="color: #999; font-style: italic; margin: 5px 0;">None selected</p>'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>This email was sent from the Wallyax VPAT Form submission system</p>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
                  `
                };

                await transporter.sendMail(additionalEmailData);
              } catch (emailError) {
                console.error('Email notification error:', emailError);
              }

              // Add contact to Brevo
              try {
                console.log('[Brevo] Handler reached');
                const BREVO_API_KEY = process.env.BREVO_API_KEY;
                const BREVO_CONTACTS_ENDPOINT = 'https://api.brevo.com/v3/contacts';
                const email = data['contact-information-email'];
                const rawListId = process.env.BREVO_VPAT_LIST_ID;
                const listId = rawListId ? parseInt(String(rawListId).trim(), 10) : NaN;

                console.log('[Brevo] Config check', {
                  hasApiKey: !!BREVO_API_KEY,
                  apiKeyLength: BREVO_API_KEY ? BREVO_API_KEY.length : 0,
                  rawListId: rawListId,
                  parsedListId: listId,
                  isListIdValid: !isNaN(listId) && listId > 0,
                  nodeEnv: process.env.NODE_ENV
                });

                if (!BREVO_API_KEY || isNaN(listId) || listId <= 0) {
                  console.error('[Brevo] Config missing or invalid - skipping Brevo integration', {
                    hasApiKey: !!BREVO_API_KEY,
                    rawListId: rawListId,
                    parsedListId: listId
                  });
                  // Don't return - continue with rest of form submission
                } else if (email) {
                  console.log('[Brevo] Processing contact', { email });

                  const payload = {
                    email,
                    updateEnabled: true,
                    listIds: [listId],
                    attributes: {
                      PRODUCT_NAME: data['name-of-product'] || undefined,
                      PRODUCT_DESCRIPTION: data['product-description'] || undefined,
                      REPORT_DATE: data['report-date'] || undefined,
                      SIGNUP_SOURCE: 'VPAT Form',
                    },
                  };

                  let contactHandled = false;

                  try {
                    console.log('[Brevo] Creating contact...');
                    const createResponse = await axios.post(BREVO_CONTACTS_ENDPOINT, payload, {
                      timeout: 15000,
                      headers: {
                        'api-key': BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                      },
                    });
                    console.log('[Brevo] Contact created successfully', { email, status: createResponse.status });
                    contactHandled = true;
                  } catch (createError) {
                    console.log('[Brevo] Create contact error', {
                      message: createError.message,
                      status: createError.response?.status,
                      code: createError.response?.data?.code
                    });
                    // If contact already exists (duplicate_parameter error), add them to the list
                    if (createError.response?.status === 400 && 
                        createError.response?.data?.code === 'duplicate_parameter') {
                      try {
                        console.log('[Brevo] Contact exists, adding to list...');
                        // Add existing contact to the specific list
                        await axios.post(
                          `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
                          { emails: [email] },
                          {
                            timeout: 15000,
                            headers: {
                              'api-key': BREVO_API_KEY,
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                            },
                          }
                        );
                        console.log('[Brevo] Existing contact added to list', { email, listId });
                        
                        // Update the contact's attributes
                        await axios.put(
                          `${BREVO_CONTACTS_ENDPOINT}/${encodeURIComponent(email)}`,
                          {
                            attributes: {
                              PRODUCT_NAME: data['name-of-product'] || undefined,
                              PRODUCT_DESCRIPTION: data['product-description'] || undefined,
                              REPORT_DATE: data['report-date'] || undefined,
                              SIGNUP_SOURCE: 'VPAT Form',
                            },
                          },
                          {
                            timeout: 15000,
                            headers: {
                              'api-key': BREVO_API_KEY,
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                            },
                          }
                        );
                        console.log('[Brevo] Contact attributes updated', { email });
                        contactHandled = true;
                      } catch (addToListError) {
                        console.error('[Brevo] Error adding existing contact to list:', {
                          email,
                          error: addToListError.response?.data || addToListError.message,
                        });
                      }
                    } else {
                      // Some other error occurred - log it but don't throw
                      console.error('[Brevo] Unexpected error creating contact:', {
                        email,
                        message: createError.message,
                        status: createError.response?.status,
                        data: createError.response?.data
                      });
                    }
                  }

                  // Trigger Brevo event for workflow (works for both new and existing contacts)
                  if (contactHandled) {
                    try {
                      console.log('[Brevo] Triggering event...');
                      const eventPayload = {
                        event_name: 'vpat_form_submitted',
                        event_properties: {
                          source: 'VPAT Form'
                        },
                        identifiers: {
                          email_id: email 
                        }
                      };
                      
                      const eventResponse = await axios.post(
                        'https://api.brevo.com/v3/events',
                        eventPayload,
                        {
                          timeout: 15000,
                          headers: {
                            'api-key': BREVO_API_KEY,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                          },
                        }
                      );
                      console.log('[Brevo] Event triggered successfully', { email, status: eventResponse.status });
                    } catch (eventError) {
                      console.error('[Brevo] Event trigger error:', {
                        email,
                        status: eventError.response?.status,
                        error: eventError.response?.data || eventError.message,
                      });
                    }
                  } else {
                    console.log('[Brevo] Event not triggered - contact was not handled successfully');
                  }
                } else {
                  console.log('[Brevo] Skipped: missing email');
                }
              } catch (brevoError) {
                console.error('[Brevo] Unexpected error:', {
                  email: data['contact-information-email'],
                  error: brevoError.response?.data || brevoError.message,
                  status: brevoError.response?.status,
                });
              }

              try {
                const slackWebhookUrl = "https://hooks.slack.com/services/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";                
                const slackMessage = {
                  text: `New VPAT Form Submission - WallyAX
Product Name: ${data['name-of-product'] || 'Not provided'}
Product Description: ${data['product-description'] || 'Not provided'}
Business Email: ${data['contact-information-email'] || 'Not provided'}
Report Date: ${data['report-date'] || 'Not provided'}
Applicable  Laws/Acts: ${(data['applicable-laws-acts'] || []).length > 0 ? (data['applicable-laws-acts'] || []).join(', ') : 'None selected'}
Assistive Technologies: ${(data['assistive-technologies'] || []).length > 0 ? (data['assistive-technologies'] || []).join(', ') : 'None selected'}
Automated Audit Tools: ${(data['automated-audit-tools'] || []).length > 0 ? (data['automated-audit-tools'] || []).join(', ') : 'None selected'}`
                };

                await axios.post(slackWebhookUrl, slackMessage);
                console.log('ACR Form Slack notification sent');
              } catch (slackError) {
                console.error('Slack notification error:', slackError);
              }

              req.session.message = 'VPAT Form submitted successfully';
              } catch (acrError) {
                console.error('VPAT Form submission error:', acrError);
                throw new Error('VPAT Form submission failed. Please try again later.');
              }
            }
            else if (form.slug === 'free-report-form') {
              const submissionData = {
                title: data.website,
                website: data.website,
                published: true,
                ...data
              };
              const submissionUrl = `${process.env.APOS_BASE_URL}/api/v1/free-report-form?apikey=${process.env.APOS_ADMIN_API_KEY}`;
              axios.post(submissionUrl, submissionData)
                .catch(function (error) {
                  console.log('api error', error);
                });
              if (form.linkUrl) {
                const formData = {
                  url: data.website
                };
                const url = form.linkUrl;
                axios.post(url, formData)
                  .catch(function (error) {
                    console.error(error);
                  });
              }
              req.session.message = 'Form redirected and submitted successfully';
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

