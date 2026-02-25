module.exports = {
  options: {
    label: 'Video Embed',
    description: 'Add a video player from services like YouTube',
    previewImage: 'jpg'
  },
  fields: {
    add: {
      video: {
        type: 'url',
        label: 'Video URL',
        required: false,
        help: 'Enter a video URL (e.g., YouTube or Vimeo)',
        hidden: true
      },
      embedCode: {
        label: 'Embed Code',
        type: 'string',
        help: 'Paste Embed Code here (YouTube, Spotify, vimeo, etc.,)'
      }
    }
  }
};
