const areaConfig = require('../../lib/area');
module.exports = {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Blog Page',
    pluralLabel: 'Blog Pages',
    perPage: 10
  },
  fields: {
    // add the content field to the
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
      },
      content: {
        type: 'area',
        options: {
          widgets: {
            ...areaConfig.richText
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
          'main',
          'content'
        ]
      }
    }
  },
  handlers(self) {
    return {
      beforeIndex(req, options) {
        if (req.query.category) {
          options.filters = {
            ...options.filters,
            category: req.query.category
          };
        }
        if (req.query.search) {
          const searchRegex = new RegExp(req.query.search, 'i');
          options.filters = {
            ...options.filters,
            title: searchRegex
          };
        }
      }
    };
  }

};
