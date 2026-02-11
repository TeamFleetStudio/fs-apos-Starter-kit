// fs-apostrophe-cms-starter/lib/buttonSchema.js
const link = require('./linkSchema');
const backgroundSchema = require('./backgroundSchema');
const customAttributesSchema = require('./customAttributesSchema');

const button = {
  //
  // ORDER intentionally mirrors Wallyax CTA button as closely as possible.
  //

  // 1. Content / visual (Wallyax: text, textColor, bgColor, alignment, size, weight, border…)
  linkText: link.linkText, // Wallyax: `text`

  style: {
    type: 'select',
    label: 'Color Style',
    required: true,
    help: 'Select Custom to set a custom background color',
    choices: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Custom', value: 'custom' }
    ]
  },

  textColor: {
    ...backgroundSchema.textColor,
    help: 'Choose a text color that contrasts well with the background color',
    if: { style: 'custom' }
  },
  backgroundColor: {
    ...backgroundSchema.backgroundColor,
    if: { style: 'custom' }
  },

  alignment: {
    type: 'select',
    label: 'Alignment',
    help: 'Defaults to center',
    def: 'center',
    choices: [
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' }
    ]
  },

  isSvgIcon: {
    type: 'boolean',
    label: 'SVG Icon',
    def: false
  },

  svgIcon: {
    type: 'codeEditor',
    label: 'HTML snippet for SVG Icon',
    if: { isSvgIcon: true },
    required: true
  },

  iconPlacement: {
    type: 'select',
    label: 'Icon Placement',
    help: 'Defaults to end',
    def: 'end',
    choices: [
      { label: 'Start', value: 'start' },
      { label: 'End', value: 'end' }
    ],
    if: { isSvgIcon: true },
    required: true
  },
  border: {
    type: 'boolean',
    label: 'Border',
    def: false
  },
  borderColor: {
    type: 'color',
    label: 'Border Color',
    if: { border: true }
  },
  borderRadius: {
    type: 'range',
    label: 'Border Radius',
    help: 'Set the border radius for the button',
    min: 0,
    max: 50,
    step: 2,
    def: 0
  },

  size: {
    type: 'select',
    label: 'Size',
    required: true,
    choices: [
      { label: 'Regular', value: '' },
      { label: 'Small', value: 'sm' },
      { label: 'Large', value: 'lg' }
    ]
  },

  weight: {
    type: 'select',
    label: 'Text Weight',
    help: 'Defaults to normal',
    def: 'normal',
    choices: [
      { label: 'Normal', value: 'normal' },
      { label: 'Light', value: 'light' },
      { label: 'Bold', value: 'bold' },
      { label: 'Bolder', value: 'extrabold' }
    ]
  },

  // Redirect/Link fields (from Wallyax)
  isRedirect: {
    type: 'boolean',
    label: 'Redirect to another page',
    def: false
  },
  linkType: {
    ...link.linkType,
    required: true,
    if: {
      isRedirect: true
    }
  },
  _linkPage: {
    ...link._linkPage,
    if: {
      $and: [
        { linkType: 'page' },
        { isRedirect: true }
      ]
    }
  },
  _linkFile: {
    ...link._linkFile,
    if: {
      $and: [
        { linkType: 'file' },
        { isRedirect: true }
      ]
    }
  },
  linkUrl: {
    ...link.linkUrl,
    if: {
      $and: [
        { linkType: 'custom' },
        { isRedirect: true }
      ]
    }
  },
  linkTarget: {
    ...link.linkTarget,
    if: {
      isRedirect: true
    }
  },
  ariaLabel: {
    ...link.ariaLabel,
  },

  // 4. Extra (Wallyax: horizontalRule)
  horizontalRule: {
    type: 'boolean',
    label: 'Horizontal Rule',
    help: 'CTA will be placed in between the horizontal rule',
    def: false
  },

  // 5. Custom attributes (starter)
  ...customAttributesSchema
};

module.exports = { button };