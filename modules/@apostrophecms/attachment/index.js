module.exports = {
  init(self) {
    // Add video file group with allowed extensions
    const newGroups = [
      {
        name: 'video',
        label: 'Video',
        extensions: [ 'mp4', 'webm', 'mov', 'avi' ],
        extensionMaps: {},
        image: false
      }
    ];
    self.fileGroups = [ ...self.fileGroups, ...newGroups ];
  }
};
