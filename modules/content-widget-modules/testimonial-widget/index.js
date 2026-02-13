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
            name: {
              label: 'Author Name',
              type: 'string',
              required: true,
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
                  'image': {}
                }
              }
            },
            designation: {
                label: 'Designation',
                type: 'string',
                required: true
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
            bgColor:{
                type: 'color',
                label: 'Background Color',
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
                label: 'Star Color',
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
