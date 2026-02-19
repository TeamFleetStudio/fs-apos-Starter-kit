module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Whitepaper',
    pluralLabel: 'Whitepaper',
    openGraph: false,
    seoFields: true,
    showCreate: false,
    autopublish: true
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Title'
      },
      firstName: {
        type: 'string',
        label: 'First Name',
        required: true
      },
      lastName: {
        type: 'string',
        label: 'Last Name',
        required: true
      },
      email: {
        type: 'string',
        label: 'email',
        required: true
      },
      jobTitle: {
        type: 'string',
        label: 'Job Title'
      }
    },
    group: {
      formData: {
        label: 'Form Data',
        fields: [ 'title', 'firstName', 'lastName', 'email', 'jobTitle' ]
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
      }
    },
    order: [ 'title', 'email' ]
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
