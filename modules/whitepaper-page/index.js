const areaConfig = require('../../lib/area');
module.exports = {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Whitepaper Page',
    pluralLabel: 'Whitepaper Pages',
    perPage: 9
  },
  fields: {
    // add tge content field to the
    // "@apostrophe/blog" piece definition
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
    // add the "content" fields to the
    // "Basics" fields
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
