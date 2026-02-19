const areaConfig = require('../../lib/area');

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Product Digest',
    perPage: 9,
    sort: { createdAt: -1 }
  },
  fields: {
    add: {
      shortDescription: {
        label: 'Short Description',
        type: 'string'
      },
      content: {
        type: 'area',
        label: 'Content',
        options: {
          widgets: {
            ...areaConfig.richText,
            'video-upload': {}
          }
        }
      },
      bannerImage: {
        type: 'area',
        label: 'Blog Image',
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
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'shortDescription',
          'content',
          'bannerImage',
          'metaTitle',
          'metaDescription'
        ]
      }
    }
  }
};
