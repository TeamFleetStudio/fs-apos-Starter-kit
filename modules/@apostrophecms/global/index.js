const linkSchema = require('../../../lib/linkSchema');
const navLinkSchema = require('../../../lib/navLinkSchema');
const buttonSchema = require('../../../lib/buttonSchema');
const backgroundSchema = require('../../../lib/backgroundSchema');
const customAttributesSchema = require('../../../lib/customAttributesSchema');
const areaConfig = require('../../../lib/area');

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
      skipLinkTextColor: {
        type: 'color',
        label: 'Skip Link Text Color',
        help: 'Font color of the "Skip to main content" button (default: #ffffff)',
        def: '#ffffff'
      },
      skipLinkBgColor: {
        type: 'color',
        label: 'Skip Link Background Color',
        help: 'Background color of the "Skip to main content" button (default: #000000)',
        def: '#000000'
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
            label: 'Header Layout 1',
            value: 'header-layout-1'
          },
          {
            label: 'Header Layout 2',
            value: 'header-layout-2'
          }
        ]
      },
      headerLogo: {
        label: 'Header Logo',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
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
        },
        if: {
          headerLayout: {
            $in: ['default', 'header-layout-1']
          }
        }
      },
      headerNavLayout2: {
        label: 'Header Navigation Items',
        help: 'Navigation items with dropdown submenu support',
        type: 'array',
        titleField: 'linkText',
        fields: {
          add: {
            ...navLinkSchema,
          }
        },
        if: {
          headerLayout: 'header-layout-2'
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
          headerLayout: {
            $in: ['default', 'header-layout-2']
          }
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
          headerLayout: {
            $in: ['default', 'header-layout-2']
          }
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
            label: 'Footer Layout 1',
            value: 'footer-layout-1'
          },
          {
            label: 'Footer Layout 2',
            value: 'footer-layout-2'
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
          footerLayout: 'footer-layout-1'
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
        }
      },
      footerDescription: {
        label: 'Footer Description',
        type: 'string',
        textarea: true,
        if: {
          footerLayout: 'footer-layout-1'
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
          footerLayout: 'footer-layout-1'
        }
      },
      footerNavigationColumns: {
        label: 'Footer Navigation Columns',
        help: 'Add navigation columns. Each column can have up to 3 sections.',
        type: 'array',
        titleField: 'columnLabel',
        fields: {
          add: {
            columnLabel: {
              type: 'string',
              label: 'Column Label (for reference only)',
              help: 'This is just for identifying the column in the list'
            },
            sections: {
              label: 'Sections (Max 3)',
              type: 'array',
              titleField: 'title',
              max: 3,
              fields: {
                add: {
                  title: {
                    type: 'string',
                    label: 'Section Title'
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
              }
            }
          }
        },
        if: {
          footerLayout: 'footer-layout-2'
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
          footerLayout: 'footer-layout-1'
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
          footerLayout: 'footer-layout-1'
        }
      },
      footerPoweredByLogo: {
        label: 'Powered By Logo',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          footerLayout: 'footer-layout-2'
        }
      },
      footerPoweredByText: {
        label: 'Powered By Text',
        type: 'string',
        def: 'Powered by',
        if: {
          footerLayout: 'footer-layout-2'
        }
      },
      footerLegalLinks: {
        label: 'Legal Links',
        type: 'array',
        titleField: 'linkText',
        fields: {
          add: {
            ...linkSchema
          }
        },
        if: {
          footerLayout: 'footer-layout-2'
        }
      },
      footerCopyrightText: {
        label: 'Copyright Text',
        type: 'string',
        help: 'Use {year} to insert current year automatically',
        def: '© {year} FS Academy',
        if: {
          footerLayout: 'footer-layout-2'
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
      },
      form: {
        type: 'area',
        label: 'Form',
        options: {
          widgets: {
            '@apostrophecms/image': {},
            ...areaConfig.richText,
            'custom-form': {}
          }
        }
      },
      blogTopRightSection: {
        type: 'area',
        label: 'Top Right Section',
        help: 'The contents here will be rendered at the top right sidebar of all blog-detail pages. (global top right section)',
        options: {
          expanded: true,
          groups: {
            ...areaConfig.fullExpandedGroup
          }
        }
      },
      blogBottomSection: {
        type: 'area',
        label: 'Bottom Section',
        help: 'The contents here will be rendered at the bottom of all blog-detail pages. (global bottom section)',
        options: {
          expanded: true,
          groups: {
            ...areaConfig.fullExpandedGroup
          }
        }
      },
      whitepaperBottomSection: {
        type: 'area',
        label: 'Bottom Section',
        help: 'The contents here will be rendered at the bottom of all whitepaper-detail pages. (global bottom section)',
        options: {
          expanded: true,
          groups: {
            ...areaConfig.fullExpandedGroup
          }
        }
      },
      podcastBottomSection: {
        type: 'area',
        label: 'Bottom Section',
        help: 'The contents here will be rendered at the bottom of all podcast-detail pages. (global bottom section)',
        options: {
          expanded: true,
          groups: {
            ...areaConfig.fullExpandedGroup
          }
        }
      }
    },
    group: {
      brand: {
        label: 'Brand',
        fields: ['title', 'logo', 'primaryColor', 'secondaryColor', 'headingFontFamily', 'bodyFontFamily', 'skipLinkTextColor', 'skipLinkBgColor']
      },
      header: {
        label: 'Header',
        fields: ['headerLayout', 'headerLogo', 'headerNav', 'headerNavLayout2', 'headerBtns', 'headerButtonSpacing', 'headerBackgroundColor', 'headerTextColor', 'headerCustomClassName', 'headerCustomId']
      },
      footer: {
        label: 'Footer',
        fields: [
          'footerLayout',
          'footerLogo',
          'footerNav',
          'footerBtns',
          'footerButtonSpacing',
          'footerBackgroundColor',
          'footerTextColor',
          'footerCustomClassName',
          'footerCustomId',
          'footerBgImg',
          'footerDescription',
          'footerPrimaryNavigation',
          'footerNavigationColumns',
          'footerSourceForgeScript',
          'footerPoweredByLogo',
          'footerPoweredByText',
          'footerLegalLinks',
          'footerCopyrightText'
        ]
      },
      socialMediaPlatforms: {
        label: 'Social Media Platform',
        fields: ['social', 'footerSocial']
      },
      custom: {
        label: 'Custom Code',
        fields: ['customCSS', 'customJavaScriptHead', 'customJavaScript']
      },
      Form: {
        label: 'Report Form',
        fields: ['form']
      },
      BLOG: {
        label: 'BLOG',
        fields: ['blogTopRightSection', 'blogBottomSection']
      },
      WHITEPAPER: {
        label: 'WHITEPAPER',
        fields: ['whitepaperBottomSection']
      },
      PODCAST: {
        label: 'PODCAST',
        fields: ['podcastBottomSection']
      }
    }
  }
}
