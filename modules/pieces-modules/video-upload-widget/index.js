module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Video Upload',
    description: 'Display list of videos on your page',
    previewImage: 'svg',
    icon: 'video-icon'
  },

  fields: {
    add: {
      _video: {
        type: 'relationship',
        withType: 'video-upload',
        label: 'Select Video...',
        required: true,
        builders: {
          project: {
            type: 'video-upload',
            title: 1,
            Thumbnail: 1,
            video: 1,
            VideoClassName: 1,
            VideoID: 1
          }
        }
      },
      VideosectionClassName: {
        type: 'string',
        help: 'This can be used to write custom css',
        label: 'Section Class'
      },
      VideosectionID: {
        type: 'string',
        help: 'This can be used to write custom ID',
        label: 'Section ID'
      }
    }
  }
};

