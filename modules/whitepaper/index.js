const areaConfig = require('../../lib/area');
module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Whitepaper',
    perPage: 9,
    sort: { createdAt: -1 }
    // Additionally add a `pluralLabel` option if needed.
  },
  fields: {
    // add tge content field to the
    // "@apostrophe/blog" piece definition
    add: {
      meta: {
        label: 'Short Description',
        type: 'string'
      },
      content: {
        type: 'area',
        options: {
          widgets: {
            ...areaConfig.richText,
            'image': {},
            'custom-form': {}
          }
        }
      },
      bannerImage: {
        type: 'area',
        label: 'Whitepaper Image',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      metaTitle: {
        label: 'Meta Title',
        type: 'string'
      },
      metaDescription: {
        label: 'Meta Description',
        type: 'string'
      }
    },
    // add the "content" fields to the
    // "Basics" fields
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'meta',
          'content',
          'tag',
          'bannerImage',
          'metaTitle',
          'metaDescription'
        ]
      }
    }
  }
};
