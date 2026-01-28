const linkSchema = require('../../../lib/linkSchema');
const buttonSchema = require('../../../lib/buttonSchema');
const backgroundSchema = require('../../../lib/backgroundSchema');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

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
        help: 'Primary brand color (default: #000000)',
        def: '#000000'
      },
      secondaryColor: {
        type: 'color',
        label: 'Secondary Color',
        help: 'Secondary brand color (default: #2850EB)',
        def: '#2850EB'
      },
      headingFontFamily: {
        type: 'string',
        label: 'Heading Font Family',
        help: 'Enter Google Font name for headings (e.g., Bungee, Rubik Storm). Defaults to Lato.',
        def: 'Lato'
      },
      bodyFontFamily: {
        type: 'string',
        label: 'Body Font Family',
        help: 'Enter Google Font name for body text (e.g., Bungee, Rubik Storm). Defaults to Merriweather.',
        def: 'Merriweather'
      },
      headerBtns: {
        label: 'Header Button/s',
        type: 'array',
        titleField: 'linkText',
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
        fields: {
          add: {
            ...linkSchema,
          }
        }
      },
      headerBackgroundColor: backgroundSchema.backgroundColor,
      headerTextColor: backgroundSchema.textColor,
      headerButtonSpacing: {
        type: 'range',
        label: 'Header Button Spacing',
        help: 'Set the spacing between header buttons',
        min: 0,
        max: 50,
        step: 1,
        def: 16
      },
      headerCustomClassName: {
        ...customAttributesSchema.customClassName,
        help: 'Add a custom CSS class to the header'
      },
      headerCustomId: {
        ...customAttributesSchema.customId,
        help: 'Add a custom ID attribute to the header'
      },
      footerNav: {
        label: 'Footer Navigation Items',
        type: 'array',
        titleField: 'linkText',
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
        fields: {
          add: {
            ...buttonSchema.button
          }
        }
      },
      footerBackgroundColor: backgroundSchema.backgroundColor,
      footerTextColor: backgroundSchema.textColor,
      footerButtonSpacing: {
        type: 'range',
        label: 'Footer Button Spacing',
        help: 'Set the spacing between footer buttons',
        min: 0,
        max: 50,
        step: 1,
        def: 16
      },
      footerCustomClassName: {
        ...customAttributesSchema.customClassName,
        help: 'Add a custom CSS class to the footer'
      },
      footerCustomId: {
        ...customAttributesSchema.customId,
        help: 'Add a custom ID attribute to the footer'
      },
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
      customJavaScriptHead: {
        type: 'codeEditor',
        label: 'Custom JavaScript (Head)',
        help: 'Add your custom JavaScript code in the head section. Enclose with &lt;script&gt; &lt;/script&gt; tags.',
        defaultLanguage: 'javascript',
        theme: 'dark',
        languages: [
          { label: 'JavaScript', value: 'javascript' }
        ]
      },
      customJavaScript: {
        type: 'codeEditor',
        label: 'Custom JavaScript (Body)',
        help: 'Add your custom JavaScript code in the body section. Enclose with &lt;script&gt; &lt;/script&gt; tags.',
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
        fields: ['title', 'logo', 'social', 'primaryColor', 'secondaryColor', 'headingFontFamily', 'bodyFontFamily']
      },
      header: {
        label: 'Header',
        fields: ['headerNav', 'headerBtns', 'headerButtonSpacing', 'headerBackgroundColor', 'headerTextColor', 'headerCustomClassName', 'headerCustomId']
      },
      footer: {
        label: 'Footer',
        fields: ['footerNav', 'footerBtns', 'footerButtonSpacing', 'footerBackgroundColor', 'footerTextColor', 'footerCustomClassName', 'footerCustomId']
      },
      custom: {
        label: 'Custom Code',
        fields: ['customCSS', 'customJavaScriptHead', 'customJavaScript']
      }
    }
  }
}
