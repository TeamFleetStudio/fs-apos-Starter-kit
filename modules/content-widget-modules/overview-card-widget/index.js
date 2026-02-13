module.exports = {
    extend: '@apostrophecms/widget-type',
    options: {
      label: 'Overview-Card Widget',
      description: 'Add your team for services',
      previewImage: 'svg'
    },
    icons: {
      'cards-icon': 'Cards'
    },
    fields: {
      add: {
        style: {
          type: 'select',
          label: 'Layout style',
          required: true,
          choices: [
            {
              label: 'Full width',
              value: 'full',
              def: true
            },
            {
              label: 'Contained width',
              value: 'contained'
            }
          ]
        },
        overviewCard: {
          label: 'Overviews',
          type: 'array',
          titleField: 'title',
          fields: {
            add: {
              title: {
                label: 'title',
                type: 'string',
              },
              image: {
                label: 'Image',
                type: 'area',
                options: {
                  max: 1,
                  widgets: {
                    'image': {}
                  }
                }
              },
              content: {
                label: 'Content',
                type: 'area',
                options: {
                  widgets: {
                    'rich-text':{}
                  }
                }
              },
              items:{
                label: 'Items',
                type: 'array',
                titleField: 'heading',
                fields: {
                  add: {
                    heading:{
                      label: 'Heading',
                      type: 'string',
                    },
                    subHeading: {
                      label: 'Sub Heading',
                      type: 'string',
                    },
                    description: {
                      label: 'Description',
                      type: 'string',
                    },
                    icon:{
                      label: 'Icon',
                      type: 'area',
                      options: {
                        max: 1,
                        widgets: {
                          'image': {}
                        }
                      }
                    },
                    url: {
                      label: 'URL',
                      type: 'url',
                    }
                  }
                }
              },
              btn:{
                type: 'area',
                label: 'Button',
                options: {
                  widgets: {
                    'button': {}
                  }
                }
              },
              widgetClass: {
                type: 'string',
                help: 'It can be use to write custom css',
                label: 'Widget class name'
              },
            }
          }
        },
        widgetClass: {
          type: 'string',
          help: 'It can be use to write custom css',
          label: 'Widget class name'
        },
        widgetId: {
          type: 'string',
          help: 'Use only for scroll to element.',
          label: 'Widget Id'
        }
      }
    }
  };
