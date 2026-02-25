const buttonSchema = require('../../../lib/buttonSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Card Widget',
    icon: 'menu-open-icon',
    description: 'Add card widget to your page',
    previewImage: 'svg'
  },
  icons: {
    'menu-open-icon': 'MenuOpen'
  },
  fields: {
    add: {
      card: {
        type: 'array',
        label: 'Cards',
        titleField: 'content',
        fields: {
          add: {
            bannerImage: {
              type: 'area',
              label: 'Banner Image',
              options: {
                widgets: {
                  '@apostrophecms/image': {}
                }
              }
            },
            title: {
              type: 'string',
              label: 'Title'
            },
            content: {
              type: 'string',
              label: 'Content'
            },
            isRedirectToAnotherPage: {
              type: 'boolean',
              label: 'Redirect to another page',
              def: false
            },
            linkType: {
              label: 'Link Type',
              type: 'select',
              required: true,
              choices: [
                {
                  label: 'Page',
                  value: 'page'
                },
                {
                  label: 'File',
                  value: 'file'
                },
                {
                  label: 'Custom URL',
                  value: 'custom'
                }
              ],
              if: {
                isRedirectToAnotherPage: true
              }
            },
            _linkPage: {
              label: 'Page to link',
              type: 'relationship',
              withType: '@apostrophecms/page',
              max: 1,
              builders: {
                project: {
                  type: '@apostrophecms/page',
                  title: 1,
                  _url: 1
                }
              },
              if: {
                linkType: 'page'
              }
            },
            _linkFile: {
              label: 'File to link',
              type: 'relationship',
              withType: '@apostrophecms/file',
              max: 1,
              if: {
                linkType: 'file'
              }
            },
            linkUrl: {
              label: 'URL for custom link',
              type: 'url',
              if: {
                linkType: 'custom'
              }
            },
            linkTarget: {
              label: 'Will the link open a new browser tab?',
              type: 'checkboxes',
              choices: [
                {
                  label: 'Open in new tab',
                  value: '_blank'
                }
              ],
              if: {
                isRedirectToAnotherPage: true
              }
            },
            ariaLabel: {
              label: 'Aria label',
              type: 'string',
              help: 'This is used for screen readers and SEO',
              if: {
                isRedirectToAnotherPage: true
              }
            },
            widgetClass: {
              type: 'string',
              help: 'It can be use to write custom css',
              label: 'Widget class name'
            },
            cardBtns: {
              label: 'Card Button/s',
              type: 'array',
              titleField: 'linkText',
              limit: 1,
              fields: {
                add: {
                  ...buttonSchema.button
                }
              }
            }
          }
        }
      }
    }
  }
};
