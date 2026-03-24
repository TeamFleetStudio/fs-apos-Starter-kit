const link = {
  linkText: {
    label: 'Link Text',
    type: 'string'
  },
  hasDropdown: {
    label: 'Has Dropdown Submenu',
    type: 'boolean',
    def: false,
    help: 'Enable to add submenu items. The main nav item will become a button.'
  },
  linkType: {
    label: 'Link Type',
    type: 'select',
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
      hasDropdown: false
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
      linkType: 'page',
      hasDropdown: false
    }
  },
  _linkFile: {
    label: 'File to link',
    type: 'relationship',
    withType: '@apostrophecms/file',
    max: 1,
    if: {
      linkType: 'file',
      hasDropdown: false
    }
  },
  linkUrl: {
    label: 'URL for custom link',
    type: 'url',
    if: {
      linkType: 'custom',
      hasDropdown: false
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
      hasDropdown: false
    }
  },
  submenuItems: {
    label: 'Submenu Navigation Items',
    type: 'array',
    titleField: 'submenuLinkText',
    if: {
      hasDropdown: true
    },
    fields: {
      add: {
        submenuLinkText: {
          label: 'Link Text',
          type: 'string'
        },
        submenuLinkType: {
          label: 'Link Type',
          type: 'select',
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
          ]
        },
        _submenuLinkPage: {
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
            submenuLinkType: 'page'
          }
        },
        _submenuLinkFile: {
          label: 'File to link',
          type: 'relationship',
          withType: '@apostrophecms/file',
          max: 1,
          if: {
            submenuLinkType: 'file'
          }
        },
        submenuLinkUrl: {
          label: 'URL for custom link',
          type: 'url',
          if: {
            submenuLinkType: 'custom'
          }
        },
        submenuLinkTarget: {
          label: 'Will the link open a new browser tab?',
          type: 'checkboxes',
          choices: [
            {
              label: 'Open in new tab',
              value: '_blank'
            }
          ]
        },
        submenuAriaLabel: {
          label: 'Aria label',
          type: 'string',
          help: 'This is used for screen readers and SEO'
        }
      }
    }
  },
  ariaLabel: {
    label: 'Aria label',
    type: 'string',
    help: 'This is used for screen readers and SEO'
  }
};

module.exports = link;
