const areaConfig = require('../../lib/area');
module.exports = {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Blog Page',
    pluralLabel: 'Blog Pages',
    perPage: 10
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
        if (req.query.blog_type) {
          options.filters = {
            ...options.filters,
            blog_type: req.query.blog_type
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
