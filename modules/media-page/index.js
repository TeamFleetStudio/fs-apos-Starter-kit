const areaConfig = require('../../lib/area');
module.exports = {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Media Page',
    pluralLabel: 'Media Pages',
    perPage: 9
  },
  fields: {
    add: {
      main: {
        type: 'area',
        options: {
          expanded: true,
          groups: {
            ...areaConfig.fullExpandedGroup
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'main'
        ]
      }
    }
  }
};
