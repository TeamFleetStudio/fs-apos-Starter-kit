module.exports = {
  init(self) {
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
