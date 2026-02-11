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
      headerLayout: {
        type: 'select',
        label: 'Header Layout',
        help: 'Choose which header template to use',
        def: 'default',
        choices: [
          {
            label: 'Default Header',
            value: 'default'
          },
          {
            label: 'Wallyax Header',
            value: 'wallyax'
          }
        ]
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
      headerBtns: {
        label: 'Header Button/s',
        type: 'array',
        titleField: 'linkText',
        fields: {
          add: {
            ...buttonSchema.button
          }
        },
        if: {
          headerLayout: 'default'
        }
      },
      headerBackgroundColor: {
        ...backgroundSchema.backgroundColor,
        if: {
          headerLayout: 'default'
        }
      },
      headerTextColor: {
        ...backgroundSchema.textColor,
        if: {
          headerLayout: 'default'
        }
      },
      headerButtonSpacing: {
        type: 'range',
        label: 'Header Button Spacing',
        help: 'Set the spacing between header buttons',
        min: 0,
        max: 50,
        step: 1,
        def: 16,
        if: {
          headerLayout: 'default'
        }
      },
      headerCustomClassName: {
        ...customAttributesSchema.customClassName,
        help: 'Add a custom CSS class to the header',
        if: {
          headerLayout: 'default'
        }
      },
      headerCustomId: {
        ...customAttributesSchema.customId,
        help: 'Add a custom ID attribute to the header',
        if: {
          headerLayout: 'default'
        }
      },
      footerLayout: {
        type: 'select',
        label: 'Footer Layout',
        help: 'Choose which footer template to use',
        def: 'default',
        choices: [
          {
            label: 'Default Footer',
            value: 'default'
          },
          {
            label: 'Wallyax Footer',
            value: 'wallyax'
          }
        ]
      },
      footerNav: {
        label: 'Footer Navigation Items',
        type: 'array',
        titleField: 'linkText',
        fields: {
          add: {
            ...linkSchema,
          }
        },
        if: {
          footerLayout: 'default'
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
        },
        if: {
          footerLayout: 'default'
        }
      },
      footerBackgroundColor: {
        ...backgroundSchema.backgroundColor,
        if: {
          footerLayout: 'default'
        }
      },
      footerTextColor: {
        ...backgroundSchema.textColor,
        if: {
          footerLayout: 'default'
        }
      },
      footerButtonSpacing: {
        type: 'range',
        label: 'Footer Button Spacing',
        help: 'Set the spacing between footer buttons',
        min: 0,
        max: 50,
        step: 1,
        def: 16,
        if: {
          footerLayout: 'default'
        }
      },
      footerCustomClassName: {
        ...customAttributesSchema.customClassName,
        help: 'Add a custom CSS class to the footer',
        if: {
          footerLayout: 'default'
        }
      },
      footerCustomId: {
        ...customAttributesSchema.customId,
        help: 'Add a custom ID attribute to the footer',
        if: {
          footerLayout: 'default'
        }
      },
      // Wallyax-style footer fields
      footerBgImg: {
        label: 'Footer Background Image',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          footerLayout: 'wallyax'
        }
      },
      footerLogo: {
        label: 'Footer Logo',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          footerLayout: 'wallyax'
        }
      },
      footerDescription: {
        label: 'Footer Description',
        type: 'string',
        textarea: true,
        if: {
          footerLayout: 'wallyax'
        }
      },
      footerPrimaryNavigation: {
        label: 'Footer Primary Navigations',
        type: 'array',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title'
            },
            navItems: {
              label: 'Nav Items',
              type: 'array',
              titleField: 'linkText',
              fields: {
                add: {
                  ...linkSchema
                }
              }
            }
          }
        },
        if: {
          footerLayout: 'wallyax'
        }
      },
      footerSourceForgeScript: {
        label: 'Footer Source Forge Script',
        help: 'Add JS script for SourceForge badge',
        type: 'codeEditor',
        defaultLanguage: 'javascript',
        theme: 'dark',
        languages: [
          { label: 'JavaScript', value: 'javascript' }
        ],
        if: {
          footerLayout: 'wallyax'
        }
      },
      footerSocial: {
        label: 'Footer Social Media',
        type: 'array',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Social Media Label',
              required: true
            },
            icon: {
              label: 'Icon',
              type: 'area',
              required: true,
              options: {
                max: 1,
                widgets: {
                  'image': {}
                }
              }
            },
            link: {
              type: 'url',
              label: 'Social Link',
              required: true
            }
          }
        },
        if: {
          footerLayout: 'wallyax'
        }
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
        },
        if: {
          footerLayout: 'default'
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
        fields: ['title', 'logo', 'primaryColor', 'secondaryColor', 'headingFontFamily', 'bodyFontFamily']
      },
      header: {
        label: 'Header',
        fields: ['headerNav', 'headerBtns', 'headerLayout', 'headerButtonSpacing', 'headerBackgroundColor', 'headerTextColor', 'headerCustomClassName', 'headerCustomId']
      },
      footer: {
        label: 'Footer',
        fields: [
          'footerNav',
          'footerBtns',
          'footerLayout',
          'footerButtonSpacing',
          'footerBackgroundColor',
          'footerTextColor',
          'footerCustomClassName',
          'footerCustomId',
          'footerBgImg',
          'footerLogo',
          'footerDescription',
          'footerPrimaryNavigation',
          'footerSourceForgeScript'
        ]
      },
      socialMediaPlatforms: {
        label: 'Social Media Platform',
        fields: ['social', 'footerSocial']
      },
      custom: {
        label: 'Custom Code',
        fields: ['customCSS', 'customJavaScriptHead', 'customJavaScript']
      }
    }
  }
}
