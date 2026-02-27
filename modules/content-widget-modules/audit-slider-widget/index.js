module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Audit Slider',
    description: 'Add Audit Count slider',
    previewImage: 'png'
  },
  fields: {
    add: {
      sliderBgColor: {
        type: 'color',
        label: 'Slider Background Color',
        def: '#ffffff'
      },
      titleTextColor: {
        type: 'color',
        label: 'Title Text Color',
        def: '#000000'
      },
      descriptionTextColor: {
        type: 'color',
        label: 'Description Text Color',
        def: '#434f51'
      },
      sliderBarColor: {
        type: 'color',
        label: 'Slider Bar Color',
        def: '#000000'
      },
      sliderBarBgColor: {
        type: 'color',
        label: 'Slider Bar Background Color',
        def: '#d1d5db'
      },
      slider: {
        type: 'array',
        label: 'Audit Slider',
        titleField: 'auditCount',
        fields: {
          add: {
            auditCount: {
              type: 'integer',
              label: 'Title',
              required: true
            },
            description: {
              type: 'string',
              label: 'Description',
              required: true,
            }
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
