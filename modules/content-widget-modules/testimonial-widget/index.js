const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Testimonial',
    description: 'Display testimonial of users ',
    previewImage: 'png'
  },
  fields: {
    add: {
      style: {
        type: 'select',
        label: 'Layout style',
        def: 'full',
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
      testimonial: {
        label: 'Testimonial',
        type: 'array',
        titleField: 'name',
        fields: {
          add: {
            bgColor:{
              type: 'color',
              label: 'Slide Item Background Color',
              help: 'This color will be applied to the background of the slide',
            },
            name: {
              label: 'Author Name',
              type: 'string',
              required: true,
            },
            authorNameColor: {
              type: 'color',
              label: 'Author Name Color',
            },
            position: {
                type: 'select',
                label: 'Profile Position',
                def: 'bottom',
                required: true,
                choices: [
                  {
                    label: 'Top',
                    value: 'top',
                  },
                  {
                    label: 'Bottom',
                    value: 'bottom',
                    def: true
                  }
                ]
              },
            profile: {
              label: 'Profile',
              type: 'area',
              required: true,
              options: {
                max: 1,
                widgets: {
                  'simple-image': {}
                }
              }
            },
            designation: {
                label: 'Designation',
                type: 'string',
                required: true
              },
            designationColor: {
              type: 'color',
              label: 'Designation Color',
            },
            comments: {
              label: 'Comments',
              type: 'area',
              required: true,
              options: {
                widgets: {
                  'rich-text':{}
                }
              }
            },
            quoteIconColor: {
              type: 'color',
              label: 'Quote Icon Color',
              help: 'This color will be applied to the default quote icon. (does not apply if you upload an icon)',
              def: '#ffffff'
            },
            quoteIconImage: {
              label: 'Icon (custom icon)',
              type: 'area',
              options: {
                max: 1,
                widgets: {
                  'simple-image': {}
                }
              }
            },
            quoteCircleBgColor: {
                type: 'color',
                label: 'Icon container Background Color',
            },
            ratings: {
                label: 'Ratings',
                type: 'integer',
                min: 1,
                max: 5,
                def: 5,
            },
            starColor:{
                type: 'color',
                label: 'Star Rating Color',
            },
            separatorColor: {
                type: 'color',
                label: 'Separator Color',
                def: '#E5E7EB'
            },
            widgetClass: {
              type: 'string',
              help: 'It can be use to write custom css',
              label: 'Widget class name'
            },
          }
        }
      },
      arrowColor: {
        type: 'color',
        label: 'Arrow Color',
        def: '#999999'
      },
      arrowDisabledColor: {
        type: 'color',
        label: 'Arrow Disabled Color',
        def: '#cccccc'
      },
      dotColor: {
        type: 'color',
        label: 'Dot Color',
        def: '#cccccc'
      },
      dotActiveColor: {
        type: 'color',
        label: 'Active Dot Color',
        def: '#E2AB0F'
      },
      widgetClass: {
        type: 'string',
        label: 'Widget Class Name',
        help: 'It can be used to write custom code'
      },
      widgetId: {
        type: 'string',
        help: 'Use only for scroll to element.',
        label: 'Widget Id'
      }
    }
  }
};
