module.exports = {
  options: {
    alias: 'helper'
  },
  init(self) {
    self.addHelpers({
      linkPath: (link) => {
        if (!link) {
          return '#';
        }
        let path = '#';
        if (link.linkType === 'page' && link._linkPage && link._linkPage[0] && link._linkPage[0]._url) {
          path = link._linkPage[0]._url;
        } else if (link.linkType === 'file' && link._linkFile && link._linkFile[0] && link._linkFile[0]._url) {
          path = link._linkFile[0]._url;
        } else if (link.linkType === 'custom' && link.linkUrl) {
          path = link.linkUrl;
        }
        return path;
      },
      linkTarget: (link) => {
        if (!link) {
          return '_self';
        }
        let target = '_self';
        if (link.linkTarget && Array.isArray(link.linkTarget) && link.linkTarget.length && link.linkTarget[0] === '_blank') {
          target = '_blank';
        }
        return target;
      }
    });
  }
};
