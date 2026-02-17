module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Video file',
    openGraph: false,
    seoFields: false
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Name',
        required: true
      },
      Thumbnail: {
        label: 'Thumbnail image',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      video: {
        type: 'attachment',
        help: 'Supported video format mp4 and webm',
        label: 'Video File',
        fileGroup: 'video'
      },
      VideoClassName: {
        type: 'string',
        help: 'It can be used to write custom css',
        label: 'Video  Section class'
      },
      VideoID: {
        type: 'string',
        help: 'It can be used to write custom ID',
        label: 'Video Section ID'
      }
    },
    group: {
      basics: {
        fields: [ 'title', 'Thumbnail', 'video', 'VideoClassName', 'VideoID' ]
      }
    }
  }
};

