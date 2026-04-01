const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Step Card Grid Widget',
    icon: 'view-grid-icon',
    description: 'A responsive grid of step cards with icons, titles, descriptions, and optional arrows between them'
  },
  icons: {
    'view-grid-icon': 'ViewGrid'
  },
  fields: {
    add: {
      // ── Grid Responsive Columns ──
      gridColsDesktop: {
        type: 'select',
        label: 'Grid Columns – Desktop (1024px+)',
        def: '4',
        choices: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' }
        ]
      },
      gridColsTablet: {
        type: 'select',
        label: 'Grid Columns – Tablet (768px+)',
        def: '2',
        choices: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' }
        ]
      },
      gridColsMobile: {
        type: 'select',
        label: 'Grid Columns – Mobile (640px+)',
        def: '1',
        choices: [
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]
      },

      // ── Card Border Settings ──
      hasBorder: {
        type: 'boolean',
        label: 'Card Border',
        def: true
      },
      borderWidth: {
        type: 'range',
        label: 'Border Width (px)',
        min: 1,
        max: 10,
        step: 1,
        def: 1,
        if: { hasBorder: true }
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        def: '#d3d3d3',
        if: { hasBorder: true }
      },
      borderRadius: {
        type: 'range',
        label: 'Border Radius (px)',
        min: 0,
        max: 50,
        step: 1,
        def: 14,
        if: { hasBorder: true }
      },

      // ── Section-Level Icon (between cards, e.g. arrow) ──
      hasIcon: {
        type: 'boolean',
        label: 'Show Icon Between Cards',
        def: false
      },
      sectionIconType: {
        type: 'select',
        label: 'Icon Type',
        def: 'svg',
        choices: [
          { label: 'SVG Code', value: 'svg' },
          { label: 'Image', value: 'image' }
        ],
        if: { hasIcon: true }
      },
      sectionIconSvg: {
        type: 'codeEditor',
        label: 'SVG Icon Code',
        languages: [{ label: 'HTML', value: 'html' }],
        defaultLanguage: 'html',
        if: { hasIcon: true, sectionIconType: 'svg' }
      },
      sectionIconImage: {
        type: 'area',
        label: 'Icon Image',
        options: {
          max: 1,
          widgets: { '@apostrophecms/image': {} }
        },
        if: { hasIcon: true, sectionIconType: 'image' }
      },
      // ── Cards Array ──
      cards: {
        type: 'array',
        label: 'Cards',
        fields: {
          add: {
            cardBgColor: {
              type: 'color',
              label: 'Card Background Color',
              def: '#ffffff'
            },
            // Card icon
            cardIconType: {
              type: 'select',
              label: 'Icon Type',
              def: 'svg',
              choices: [
                { label: 'SVG Code', value: 'svg' },
                { label: 'Image', value: 'image' }
              ]
            },
            cardIconSvg: {
              type: 'codeEditor',
              label: 'Card Icon SVG Code',
              languages: [{ label: 'HTML', value: 'html' }],
              defaultLanguage: 'html',
              if: { cardIconType: 'svg' }
            },
            cardIconImage: {
              type: 'area',
              label: 'Card Icon Image',
              options: {
                max: 1,
                widgets: { '@apostrophecms/image': {} }
              },
              if: { cardIconType: 'image' }
            },
            cardIconBgColor: {
              type: 'color',
              label: 'Icon Container Background Color',
              def: '#2265CA'
            },
            cardIconBorderRadius: {
              type: 'range',
              label: 'Icon Container Border Radius (px)',
              min: 0,
              max: 100,
              step: 1,
              def: 50
            },
            cardIconBorderWidth: {
              type: 'range',
              label: 'Icon Container Border Width (px)',
              min: 0,
              max: 10,
              step: 1,
              def: 0
            },
            cardIconBorderColor: {
              type: 'color',
              label: 'Icon Container Border Color'
            },
            // Card content
            content: {
              type: 'area',
              label: 'Card Content',
              options: {
                widgets: {
                  'rich-text': {}
                }
              }
            }
          }
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    },
    group: {
      basics: {
        label: 'Content',
        fields: ['cards']
      },
      gridSettings: {
        label: 'Grid Settings',
        fields: ['gridColsDesktop', 'gridColsTablet', 'gridColsMobile']
      },
      borderSettings: {
        label: 'Card Border',
        fields: ['hasBorder', 'borderWidth', 'borderColor', 'borderRadius']
      },
      iconSettings: {
        label: 'Icon Between Cards',
        fields: ['hasIcon', 'sectionIconType', 'sectionIconSvg', 'sectionIconImage']
      },
      customAttribute: {
        label: 'Custom Attribute',
        fields: ['animationEffects', 'customClassName', 'customId']
      }
    }
  }
};
