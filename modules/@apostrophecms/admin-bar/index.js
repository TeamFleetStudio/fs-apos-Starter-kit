module.exports = {
  options: {
    groups: [
      {
        name: 'site settings',
        label: 'Site Settings',
        items: [
          '@apostrophecms/user',
          '@apostrophecms/form',
          '@apostrophecms/image',
          '@apostrophecms/file',
          '@apostrophecms/image-tag',
          '@apostrophecms/file-tag',
          'video-upload'
        ]
      },
      {
        name: 'form submissions',
        label: 'Form Submissions',
        items: [
          'contact-us-form',
          'footer-form',
          'whitepaper-form',
          'about-wally-form',
          'beyond-barriers-form',
          'tools-form',
          'free-report-form',
          'acr-form'
        ]
      },
      {
        name: 'Post',
        label: 'Post',
        items: [
          'whitepaper',
          'blog',
          'product-digest',
          'media',
          'review'
        ]
      }
    ]
  }
};