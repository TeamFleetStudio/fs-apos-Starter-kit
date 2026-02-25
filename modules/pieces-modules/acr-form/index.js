module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'ACR Form',
    pluralLabel: 'ACR Forms',
    openGraph: false,
    seoFields: true,
    showCreate: false,
    autopublish: true
  },
  fields: {
    add: {
      nameOfProductVersion: {
        type: 'string',
        label: 'Name of Product Version',
        required: true
      },
      reportDate: {
        type: 'string',
        label: 'Report Date',
        required: true
      },
      productDescription: {
        type: 'string',
        label: 'Product Description',
        textarea: true,
        required: true
      },
      applicableLawsActs: {
        type: 'checkboxes',
        label: 'Applicable Laws/Acts',
        required: true,
        choices: [
          { label: 'ADA/Section 508', value: 'ADA/Section 508' },
          { label: 'EAA/EN 301 549', value: 'EAA/EN 301 549' },
          { label: 'AODA', value: 'AODA' },
          { label: 'ACA', value: 'ACA' },
          { label: 'UK Equality Act 2010', value: 'UK Equality Act 2010' },
          { label: 'Australian DDA', value: 'Australian DDA' }
        ]
      },
      assistiveTechnologies: {
        type: 'checkboxes',
        label: 'Assistive Technologies',
        required: true,
        choices: [
          { label: 'VoiceOver', value: 'VoiceOver' },
          { label: 'NVDA', value: 'NVDA' },
          { label: 'Keyboard', value: 'Keyboard' },
          { label: 'JAWS', value: 'JAWS' },
          { label: 'Talkback', value: 'Talkback' },
          { label: 'Windows Narrator', value: 'Windows Narrator' },
          { label: 'ZoomText', value: 'ZoomText' },
          { label: 'Dragon NaturallySpeaking', value: 'Dragon NaturallySpeaking' },
          { label: 'Read&Write', value: 'Read&Write' },
          { label: 'Braille Displays', value: 'Braille Displays' }
        ]
      },
      chooseForMeTechnology: {
        type: 'boolean',
        label: 'Choose for me Technology',
        def: false
      },
      automatedAuditTools: {
        type: 'checkboxes',
        label: 'Automated Audit Tools',
        required: true,
        choices: [
          { label: 'Wally WAX Chrome Extension', value: 'Wally WAX Chrome Extension' },
          { label: 'Wally Platform', value: 'Wally Platform' },
          { label: 'Wally WAX Developer Tool', value: 'Wally WAX Developer Tool' },
          { label: 'Axe Devtools', value: 'Axe Devtools' },
          { label: 'Webaim WAVE', value: 'Webaim WAVE' },
          { label: 'Lighthouse', value: 'Lighthouse' },
          { label: 'Siteimprove Accessibility Checker', value: 'Siteimprove Accessibility Checker' },
          { label: 'ARC Toolkit', value: 'ARC Toolkit' }
        ]
      },
      chooseForMeTools: {
        type: 'boolean',
        label: 'Choose for me Tools',
        def: false
      },
      contactInformationEmail: {
        type: 'email',
        label: 'Contact Information Email',
        required: true,
        validate: {
          businessEmailOnly: function(value) {
            const restrictedDomains = [
              "gmail.com",
              "yahoo.com",
              "hotmail.com",
              "aol.com",
              "hotmail.co.uk",
              "hotmail.fr",
              "msn.com",
              "yahoo.fr",
              "wanadoo.fr",
              "orange.fr",
              "live.com",
              "rediffmail.com",
              "ymail.com",
              "outlook.com",
              "hotmail.it",
              "googlemail.com",
              "rocketmail.com",
              "yahoo.in",
              "mail.com"
            ];
            
            if (!value) {
              return true; // Let required validation handle empty values
            }
            
            const emailDomain = value.toLowerCase().split('@')[1];
            
            if (restrictedDomains.includes(emailDomain)) {
              throw self.apos.error('invalid', 'Business email addresses only. Personal email domains like Gmail, Yahoo, Hotmail, etc. are not allowed.');
            }
            
            return true;
          }
        }
      }
    },
    group: {
      formData: {
        label: 'Form Data',
        fields: [
          'nameOfProductVersion',
          'reportDate',
          'productDescription',
          'applicableLawsActs',
          'assistiveTechnologies',
          'chooseForMeTechnology',
          'automatedAuditTools',
          'chooseForMeTools',
          'contactInformationEmail'
        ]
      }
    }
  },
  columns: {
    add: {
      nameOfProductVersion: {
        label: 'Product Version'
      },
      reportDate: {
        label: 'Report Date'
      },
      productDescription: {
        label: 'Product Description'
      },
      applicableLawsActs: {
        label: 'Applicable Laws/Acts'
      },
      assistiveTechnologies: {
        label: 'Assistive Technologies'
      },
      chooseForMeTechnology: {
        label: 'Choose for me Technology'
      },
      automatedAuditTools: {
        label: 'Audit Tools'
      },
      chooseForMeTools: {
        label: 'Choose for me Tools'
      },
      contactInformationEmail: {
        label: 'Contact Email'
      }
    },
    order: [
      'nameOfProductVersion',
      'reportDate',
      'productDescription',
      'applicableLawsActs',
      'assistiveTechnologies',
      'chooseForMeTechnology',
      'automatedAuditTools',
      'chooseForMeTools',
      'contactInformationEmail'
    ]
  },
  handlers(self) {
    return {
      beforeInsert: {
        async createFormSubmission(req, piece) {
          // Combine other fields into main arrays
        }
      }
    };
  }
};
