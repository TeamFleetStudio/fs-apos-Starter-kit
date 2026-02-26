module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Podcast',
    pluralLabel: 'Podcasts',
    perPage: 9,
    sort: { createdAt: -1 },
    shortcut: 'g,c'
  },
  fields: {
    add: {
      author: {
        type: 'string',
        label: 'Author Name',
        required: true
      },
      role: {
        type: 'string',
        label: 'Role',
      },
      description: {
        type: 'string',
        textarea: true,
        label: 'Short Description'
      },
      featuredImage: {
        type: 'area',
        label: 'Card Image',
        max: 1,
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      content: {
        type: 'area',
        label: 'Content',
        options: {
          widgets: {
            'video-upload': {},
            '@apostrophecms/video':{},
            'rich-text':{},
            'image':{},
            'image-card':{},
          }
        }
      },
      profileImage: {
        type: 'area',
        label: 'Profile Image',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      duration:{
        type: 'string',
        label: 'Duration of the Podcast',
      },
      externalUrl:{
        type: 'string',
        label: 'External URL',
      },
      metaTitle: {
        label: 'Meta Title',
        type: 'string'
      },
    },
    group: {
      content: {
        label: 'Content',
        fields: [ 'title', 'description', 'featuredImage', 'duration' , 'externalUrl', 'metaTitle', 'profileImage',  'author', 'role' , 'content']
      }
    }
  },
};
