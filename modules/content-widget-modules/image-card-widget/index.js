const customAttributesSchema = require('../../../lib/customAttributesSchema');
const aosSchema = require('../../../lib/aosSchema.js');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Image Card',
    icon: 'layout-side-icon',
    description: 'Display multiple small images as widgets',
    previewImage: 'svg'
  },
  icons: {
    'layout-side-icon': 'PageLayoutSidebarRight'
  },
  fields: {
    add: {
      images: {
        type: 'array',
        label: 'Images',
        titleField: 'title',
        def: [],
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
              def: [],
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
            imageClass: {
              type: 'string',
              label: 'Widget Class Name',
              help: 'It can be used to write custom code',
              def: ''
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
      isBorder: {
        type: 'boolean',
        label: 'Border for each image',
        def: false
      },
      bgImg: {
        label: 'Background Image',
        type: 'area',
        contextual: true,
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  }
};
