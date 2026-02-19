module.exports = {
    extend: '@apostrophecms/piece-type',
    options: {
      label: 'Beyond Barriers Form',
      pluralLabel: 'Beyond Barriers',
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
        email: {
          type: 'string',
          label: 'email',
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
          fields: [ 'title', 'email', 'website']
        }
      }
    },
    columns: {
      add: {
        title: {
          label: 'Title'
        },
        email: {
          label: 'Email'
        },
        website: {
          label: 'Website Url'
        }
      },
      order: [ 'title', 'email', 'website' ]
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
