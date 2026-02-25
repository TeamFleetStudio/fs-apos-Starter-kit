module.exports = {
    extend: '@apostrophecms/piece-type',
    options: {
      label: 'Free Report Form',
      pluralLabel: 'Free Report Form',
      openGraph: false,
      seoFields: true,
      showCreate: false,
      autopublish: true
    },
    fields: {
      add: {
        title: {
          type: 'string',
          label: 'Title',
          required: true
        },
        website: {
          type: 'string',
          label: 'Website Url',
          required: true
        }
      },
      group: {
        formData: {
          label: 'Form Data',
          fields: [ 'title',  'website']
        }
      }
    },
    columns: {
      add: {
        title: {
          label: 'Title'
        },
        website: {
          label: 'Website Url'
        }
      },
      order: [ 'title', 'website' ]
    },
    handlers(self) {
      return {
        beforeInsert: {
          async createFormSubmission(req, piece) {
            // put log here before insert
          }
        }
      };
    }
  };
