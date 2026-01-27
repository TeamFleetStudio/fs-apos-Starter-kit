const linkSchema = require('./linkSchema');
const backgroundSchema = require('./backgroundSchema');

const button = {
  ...linkSchema,
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
  borderRadius: {
    type: 'range',
    label: 'Border Radius',
    help: 'Set the border radius for the button',
    min: 0,
    max: 50,
    step: 2,
    def: 0
  }
};

module.exports = { button };
