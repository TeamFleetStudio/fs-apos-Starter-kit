module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Enterprise Widget',
    icon: 'layout-side-icon',
    description: 'Display Enterprise images as widgets',
    previewImage: 'svg'
  },
  icons: {
    'layout-side-icon': 'PageLayoutSidebarRight'
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Title',
        required: true
      },
      images: {
        type: 'array',
        label: 'Images',
        titleField: 'title',
        fields: {
          add: {
            orgImage: {
              type: 'area',
              label: 'Organization Image',
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
      widgetClass: {
        type: 'string',
        label: 'Widget Class Name',
        help: 'It can be used to write custom code'
      }
    }
  }
};

