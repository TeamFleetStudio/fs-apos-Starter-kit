module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Services-Team Widget',
    description: 'Add your team for services',
    previewImage: 'svg'
  },
  icons: {
    'cards-icon': 'Cards'
  },
  fields: {
    add: {
      team: {
        label: 'Team',
        type: 'array',
        titleField: 'title',
        fields: {
          add: {
            title: {
              label: 'Title',
              type: 'string',
              required: true
            },
            logo: {
              label: 'Image',
              type: 'area',
              contextual: true,
              required: true,
              options: {
                max: 1,
                widgets: {
                  '@apostrophecms/image': {}
                }
              }
            },
            description: {
              label: 'Description',
              type: 'string',
              required: true
            }
          }
        }
      },
      widgetClass: {
        type: 'string',
        help: 'It can be use to write custom css',
        label: 'Section class'
      }
    }
  }
};
