const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Hero banner',
    description: 'Display a two-column widget for the Hero Banner',
    previewImage: 'svg'
  },
  icons: {
    'view-column-icon': 'ViewColumn'
  },
  fields: {
    add: {
      one: {
        type: 'area',
        contextual: true,
        options: {
          expanded: true,
          groups: {
            ...areaConfig.heroBannerGroup
          }
        }
      },
      two: {
        type: 'area',
        contextual: true,
        options: {
          expanded: true,
          groups: {
            ...areaConfig.heroBannerGroup
          }
        }
      },
      'bg-img': {
        label: 'Background Image',
        type: 'area',
        contextual: true,
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      'bg-color': {
        label: 'Background Color',
        type: 'color'
      },
      'section-class': {
        type: 'string',
        help: 'It can be use to write custom css',
        label: 'Section class'
      }
    }
  }
};

