module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'About Wally',
    pluralLabel: 'About Wally',
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
      websiteUrl: {
        type: 'string',
        label: 'Website Url',
        required: true
      }
    },
    group: {
      formData: {
        label: 'Form Data',
        fields: [ 'title', 'email', 'websiteUrl' ]
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
      websiteUrl: {
        label: 'Website Url'
      }
    },
    order: [ 'title', 'email', 'websiteUrl' ]
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
