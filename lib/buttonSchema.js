const linkSchema = require('./linkSchema');
const backgroundSchema = require('./backgroundSchema');
const customAttributesSchema = require('./customAttributesSchema');

const button = {
  // Link behaviour (starter)
  ...linkSchema,

  // Visual style (starter)
  style: {
    type: 'select',
    label: 'Color Style',
    required: true,
    help: 'Select Custom to set a custom background color',
    choices: [
      {
        label: 'Primary',
        value: 'primary'
      },
      {
        label: 'Secondary',
        value: 'secondary'
      },
      {
        label: 'Custom',
        value: 'custom'
      }
    ]
  },

  // Background + text colors when using "custom" style (starter)
  backgroundColor: {
    ...backgroundSchema.backgroundColor,
    if: {
      style: 'custom'
    }
  },
  textColor: {
    ...backgroundSchema.textColor,
    help: 'Choose a text color that contrasts well with the background color',
    if: {
      style: 'custom'
    }
  },

  // Size (starter)
  size: {
    type: 'select',
    label: 'Size',
    required: true,
    choices: [
      {
        label: 'Regular',
        value: ''
      },
      {
        label: 'Small',
        value: 'sm'
      },
      {
        label: 'Large',
        value: 'lg'
      }
    ]
  },

  // Border radius in px (starter)
  borderRadius: {
    type: 'range',
    label: 'Border Radius',
    help: 'Set the border radius for the button',
    min: 0,
    max: 50,
    step: 2,
    def: 0
  },

  // Alignment (from Wallyax, useful in starter too)
  alignment: {
    type: 'select',
    label: 'Alignment',
    help: 'Defaults to center',
    def: 'center',
    choices: [
      {
        label: 'Center',
        value: 'center'
      },
      {
        label: 'Right',
        value: 'right'
      },
      {
        label: 'Left',
        value: 'left'
      }
    ]
  },

  // Text weight (from Wallyax)
  weight: {
    type: 'select',
    label: 'Text Weight',
    help: 'Defaults to normal',
    def: 'normal',
    choices: [
      {
        label: 'Normal',
        value: 'normal'
      },
      {
        label: 'Light',
        value: 'light'
      },
      {
        label: 'Bold',
        value: 'bold'
      },
      {
        label: 'Bolder',
        value: 'extrabold'
      }
    ]
  },

  // SVG icon support (from Wallyax, using starter code editor type)
  isSvgIcon: {
    type: 'boolean',
    label: 'SVG Icon',
    def: false
  },
  svgIcon: {
    type: 'codeEditor',
    label: 'HTML snippet for SVG Icon',
    if: {
      isSvgIcon: true
    },
    required: true
  },
  iconPlacement: {
    type: 'select',
    label: 'Icon Placement',
    help: 'Defaults to end',
    def: 'end',
    choices: [
      {
        label: 'Start',
        value: 'start'
      },
      {
        label: 'End',
        value: 'end'
      }
    ],
    if: {
      isSvgIcon: true
    },
    required: true
  },

  // Optional border controls (adapted from Wallyax)
  border: {
    type: 'boolean',
    label: 'Border',
    def: false
  },
  borderColor: {
    type: 'color',
    label: 'Border Color',
    if: {
      border: true
    }
  },

  // Horizontal rule decoration (from Wallyax)
  horizontalRule: {
    type: 'boolean',
    label: 'Horizontal Rule',
    help: 'CTA will be placed in between the horizontal rule',
    def: false
  },

  // Custom attributes (starter)
  ...customAttributesSchema
};

module.exports = { button };
