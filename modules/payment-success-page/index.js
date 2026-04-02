module.exports = {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Payment Success Page'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Success Heading',
        def: 'Payment Successful'
      },
      successMessage: {
        type: 'string',
        label: 'Success Message',
        textarea: true,
        def: 'You will receive the workshop joining details on your registered WhatsApp.'
      },
      errorHeading: {
        type: 'string',
        label: 'Error Heading',
        def: 'Payment Error'
      },
      processingHeading: {
        type: 'string',
        label: 'Processing Heading',
        def: 'Processing Payment'
      },
      processingMessage: {
        type: 'string',
        label: 'Processing Message',
        def: 'Verifying your payment. Please wait…'
      }
    },
    group: {
      basics: {
        label: 'Page Content',
        fields: ['heading', 'successMessage', 'errorHeading', 'processingHeading', 'processingMessage']
      }
    }
  }
};
