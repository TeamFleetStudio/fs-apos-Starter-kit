// This configures the @apostrophecms/pages module to add a "home" page type to the
// pages menu

module.exports = {
  options: {
    types: [
      {
        name: 'default-page',
        label: 'Default'
      },
      {
        name: '@apostrophecms/home-page',
        label: 'Home'
      },
      {
        name: 'blog-page',
        label: 'Blog page'
      },
      {
        name: 'media-page',
        label: 'Media page'
      },
      {
        name: 'product-digest-page',
        label: 'Product Digest page'
      },
      {
        name: 'whitepaper-page',
        label: 'Whitepaper page'
      }
    ]
  }
};
