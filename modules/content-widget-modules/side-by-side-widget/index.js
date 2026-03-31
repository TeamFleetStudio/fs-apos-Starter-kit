const areaConfig = require('../../../lib/area');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Side by side',
    icon: 'layout-side-icon',
    description: 'Display two sections of content side by side',
    previewImage: 'jpg'
  },
  icons: {
    'layout-side-icon': 'PageLayoutSidebarRight'
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
      invert: {
        type: 'boolean',
        label: 'Invert columns',
        required: true,
        def: false
      },
      one: {
        label: 'First Column',
        type: 'area',
        contextual: true,
        options: {
          widgets: areaConfig.all
        }
      },
      two: {
        label: 'Second Column',
        type: 'area',
        contextual: true,
        options: {
          widgets: areaConfig.all
        }
      },
      bgType: {
        type: 'select',
        label: 'Background style',
        choices: [
          {
            label: 'Background Color',
            value: 'bgColor'
          },
          {
            label: 'Background Image',
            value: 'bgImg'
          }
        ],
        def: 'bgColor'
      },
      bgColor: {
        type: 'color',
        label: 'Widget Background Color',
        help: 'Background color of widget',
        if: {
          bgType: 'bgColor'
        }
      },
      bgImgType: {
        type: 'select',
        label: 'Background Image Type',
        choices: [
          {
            label: 'Covered Image',
            value: 'bgCover'
          },
          {
            label: 'Individual BG Image',
            value: 'bgIndividual'
          }
        ],
        def: 'bgCover',
        if: {
          bgType: 'bgImg'
        }
      },
      bgImg: {
        label: 'Background Image',
        type: 'area',
        contextual: true,
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          bgImgType: 'bgCover'
        }
      },
      firstColumnImg: {
        label: 'First column background image',
        type: 'area',
        contextual: true,
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          bgImgType: 'bgIndividual'
        }
      },
      secondColumnImg: {
        label: 'Second column background image',
        type: 'area',
        contextual: true,
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        if: {
          bgImgType: 'bgIndividual'
        }
      },
      stickyColumn: {
        type: 'select',
        label: 'Sticky Column (Desktop)',
        help: 'Make one column stick while the other scrolls. Ideal when one side has shorter content.',
        choices: [
          { label: 'None', value: 'none' },
          { label: 'First Column', value: 'first' },
          { label: 'Second Column', value: 'second' }
        ],
        def: 'none'
      },
      stickyTopOffset: {
        type: 'range',
        label: 'Sticky Top Offset (px)',
        help: 'Distance from the top of the viewport when sticky',
        min: 0,
        max: 200,
        step: 1,
        def: 0,
        if: { $or: [{ stickyColumn: 'first' }, { stickyColumn: 'second' }] }
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
