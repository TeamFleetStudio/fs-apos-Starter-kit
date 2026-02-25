module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Footer',
    pluralLabel: 'Footer',
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
      }
    },
    group: {
      formData: {
        label: 'Form Data',
        fields: [ 'title', 'email' ]
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
