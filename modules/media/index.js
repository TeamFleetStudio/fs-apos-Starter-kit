module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Media',
    perPage: 9,
    sort: { createdAt: -1 }
  },
  fields: {
    add: {
      shortDescription: {
        label: 'Short Description',
        type: 'string'
      },
      bannerImage: {
        type: 'area',
        label: 'Thumbnail Image',
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
      url: {
        label: 'Post URL',
        type: 'string'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'shortDescription',
          'bannerImage',
          'metaTitle',
          'url'
        ]
      }
    }
  }
};
