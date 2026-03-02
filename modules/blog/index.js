const areaConfig = require('../../lib/area');

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Blog',
    perPage: 10,
    pluralLabel: 'Blogs',
    sort: { publishedDate: -1 }
  },
  fields: {
    add: {
      category: {
        type: 'select',
        label: 'Category',
        def: 'all',
        choices: [
          {
            label: 'All',
            value: 'all',
            def: true
          },
          {
            label: 'Creative',
            value: 'Creative'
          },
          {
            label: 'UX',
            value: 'UX'
          },
          {
            label: 'Development',
            value: 'Development'
          },
          {
            label: 'Compliance',
            value: 'Compliance'
          },
          {
            label: 'Accessibility',
            value: 'Accessibility'
          },
          {
            label: 'How-To',
            value: 'How-To'
          }
        ]
      },
      blog_type: {
        type: 'select',
        label: 'Blog Type',
        def: 'article',
        choices: [
          {
            label: 'Podcast',
            value: 'podcast',
          },
          {
            label: 'Article',
            value: 'article',
            def: true
          }
        ]
      },
      meta: {
        label: 'Short Description',
        type: 'string'
      },
      summary: {
        type: 'area',
        label: 'Sumary',
        options: {
          widgets: {
            'rich-text': {},
          }
        }
      },
      content: {
        type: 'area',
        label: 'Content',
        options: {
          widgets: {
            'rich-text': {},
            'image': {},
            'video-upload': {},
            '@apostrophecms/video': {}
          }
        }
      },
      bannerImage: {
        type: 'area',
        label: 'Blog Image',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      metaTitle: {
        label: 'Meta Title',
        type: 'string'
      },
      metaDescription: {
        label: 'Meta Description',
        type: 'string'
      },
      authorName: {
        type: 'string',
        label: 'Author Name'
      },
      authorPhoto: {
        type: 'area',
        label: 'Author Photo',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      podcastEmbed: {
        label: 'Embed Podcast',
        help: 'Add JS script for Podcast',
        type: 'codeEditor'
      },
      publishedDate: {
        type: 'date',
        label: 'Published Date'
      },
      readingTime: {
        type: 'string',
        label: 'Reading Time in Minutes'
      },
      bottomSection: {
        type: 'area',
        label: 'Bottom Section',
        help: 'Add custom forms, widgets, or other content to appear below the blog post content',
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
          'category',
          'blog_type',
          'meta',
          'summary',
          'content',
          'tag',
          'bannerImage',
          'metaTitle',
          'metaDescription',
          'authorName',
          'authorPhoto',
          'podcastEmbed',
          'publishedDate',
          'readingTime'
        ]
      },
      bottomSection: {
        label: 'Bottom Section',
        fields: [
          'bottomSection'
        ]
      }
    }
  },
  handlers(self) {
    return {
      routeBeforeSend: {
        enforceSlash301(req, res, next) {
          const slug = req.data.piece?.slug;
          if (slug && req.url.endsWith('/')) {
            return res.redirect(301, req.url.slice(0, -1));
          }
          next();
        }
      }
    };
  }
};
