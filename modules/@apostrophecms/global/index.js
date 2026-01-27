const linkSchema = require('../../../lib/linkSchema');
const buttonSchema = require('../../../lib/buttonSchema');
const backgroundSchema = require('../../../lib/backgroundSchema');

module.exports = {
  fields: {
    add: {
      logo: {
        label: 'Logo',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      title: {
        type: 'string',
        label: 'Website Title',
        required: true
      },
      primaryColor: {
        type: 'color',
        label: 'Primary Color',
        help: 'Set the primary brand color used throughout the site',
        def: '#0d1b2a'
      },
      secondaryColor: {
        type: 'color',
        label: 'Secondary Color',
        help: 'Set the secondary brand color used throughout the site',
        def: '#ef2d56'
      },
      headerBtns: {
        label: 'Header Button/s',
        type: 'array',
        titleField: 'linkText',
        limit: 1,
        fields: {
          add: {
            ...buttonSchema.button
          }
        }
      },
      headerNav: {
        label: 'Header Navigation Items',
        type: 'array',
        titleField: 'linkText',
        limit: 5,
        fields: {
          add: {
            ...linkSchema,
          }
        }
      },
      headerBackgroundColor: backgroundSchema.backgroundColor,
      headerTextColor: backgroundSchema.textColor,
      footerNav: {
        label: 'Footer Navigation Items',
        type: 'array',
        titleField: 'linkText',
        limit: 5,
        fields: {
          add: {
            ...linkSchema,
          }
        }
      },
      footerBtns: {
        label: 'Footer Button/s',
        type: 'array',
        titleField: 'linkText',
        limit: 1,
        fields: {
          add: {
            ...buttonSchema.button
          }
        }
      },
      footerBackgroundColor: backgroundSchema.backgroundColor,
      footerTextColor: backgroundSchema.textColor,
      social: {
        label: 'Social Media Accounts',
        type: 'array',
        limit: 5,
        inline: true,
        fields: {
          add: {
            link: {
              type: 'url',
              label: 'Social link',
              required: true
            },
            icon: {
              label: 'Icon',
              type: 'select',
              required: true,
              choices: [
                {
                  label: 'Instagram',
                  value: 'instagram'
                },
                {
                  label: 'Facebook',
                  value: 'facebook'
                },
                {
                  label: 'Twitter',
                  value: 'twitter'
                },
                {
                  label: 'LinkedIn',
                  value: 'linkedin'
                }
              ]
            }
          }
        }
      },
      customJavaScript: {
        type: 'codeEditor',
        label: 'Custom JavaScript',
        help: 'Add your custom JavaScript code here',
        defaultLanguage: 'javascript',
        theme: 'dark',
        languages: [
          { label: 'JavaScript', value: 'javascript' }
        ]
      },
      customCSS: {
        type: 'codeEditor',
        label: 'Custom CSS',
        help: 'Add your custom CSS code here',
        defaultLanguage: 'css',
        theme: 'dark',
        languages: [
          { label: 'CSS', value: 'css' }
        ]
      }
    },
    group: {
      brand: {
        label: 'Brand',
        fields: ['title', 'logo', 'social', 'primaryColor', 'secondaryColor']
      },
      header: {
        label: 'Header',
        fields: ['headerNav', 'headerBtns', 'headerBackgroundColor', 'headerTextColor']
      },
      footer: {
        label: 'Footer',
        fields: ['footerNav', 'footerBtns', 'footerBackgroundColor', 'footerTextColor']
      },
      custom: {
        label: 'Custom Code',
        fields: ['customJavaScript', 'customCSS']
      }
    }
  }
}
