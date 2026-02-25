module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Guests Widget',
    icon: 'layout-side-icon',
    description: 'Display beyond barriers guests as widgets',
    previewImage: 'svg'
  },
  icons: {
    'layout-side-icon': 'PageLayoutSidebarRight'
  },
  fields: {
    add: {
      name: {
        type: 'string',
        label: 'Guest Name',
        required: true
      },
      role: {
        type: 'string',
        label: 'Guest Role',
        required: true
      },
      profile: {
        type: 'area',
        label: 'Profile Picture',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        required: true
      },
      podcastsLinks: {
        type: 'array',
        label: 'Podcasts',
        titleField: 'title',
        fields: {
          add: {
            cardImage: {
              type: 'area',
              label: 'Card Image',
              options: {
                max: 1,
                widgets: {
                  '@apostrophecms/image': {}
                }
              }
            },
            title: {
              type: 'string',
              label: 'Title',
              required: true
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
            }
          }
        }
      },
      bgColor: {
        type: 'color',
        label: 'Background color',
        def: '#f4f4f4',
        required: true
      },
      widgetClass: {
        type: 'string',
        label: 'Widget Class Name',
        help: 'It can be used to write custom code'
      }
    }
  }
};
