const customAttributesSchema = require('../../../lib/customAttributesSchema');

module.exports = {
  fields: {
    add: {
      // Form styling
      formBgColor: {
        type: 'color',
        label: 'Form Background Color'
      },
      formTextColor: {
        type: 'color',
        label: 'Form Text Color'
      },
      formBorder: {
        type: 'boolean',
        label: 'Form Border',
        def: false
      },
      formBorderColor: {
        type: 'color',
        label: 'Form Border Color',
        if: { formBorder: true }
      },
      formBorderWidth: {
        type: 'range',
        label: 'Form Border Width (px)',
        min: 0,
        max: 10,
        step: 1,
        def: 1,
        if: { formBorder: true }
      },
      formBorderRadius: {
        type: 'range',
        label: 'Form Border Radius (px)',
        min: 0,
        max: 50,
        step: 1,
        def: 0
      },

      // Input field styling
      inputBorderWidth: {
        type: 'range',
        label: 'Input Border Width (px)',
        min: 0,
        max: 10,
        step: 1,
        def: 1
      },
      inputBorderColor: {
        type: 'color',
        label: 'Input Border Color'
      },
      inputBorderRadius: {
        type: 'range',
        label: 'Input Border Radius (px)',
        min: 0,
        max: 50,
        step: 1,
        def: 4
      },
      inputPlaceholderColor: {
        type: 'color',
        label: 'Input Placeholder Text Color'
      },
      labelFontSize: {
        type: 'range',
        label: 'Label Text Size (px)',
        min: 10,
        max: 48,
        step: 1,
        def: 16
      },
      inputFontSize: {
        type: 'range',
        label: 'Input Text Size (px)',
        min: 10,
        max: 48,
        step: 1,
        def: 16
      },
      errorTextColor: {
        type: 'color',
        label: 'Error Message Text Color'
      },

      // Submit button styling
      submitBgColor: {
        type: 'color',
        label: 'Button Background Color'
      },
      submitTextColor: {
        type: 'color',
        label: 'Button Text Color'
      },
      submitBorder: {
        type: 'boolean',
        label: 'Button Border',
        def: false
      },
      submitBorderColor: {
        type: 'color',
        label: 'Button Border Color',
        if: { submitBorder: true }
      },
      submitBorderWidth: {
        type: 'range',
        label: 'Button Border Width (px)',
        min: 0,
        max: 10,
        step: 1,
        def: 1,
        if: { submitBorder: true }
      },
      submitBorderRadius: {
        type: 'range',
        label: 'Button Border Radius (px)',
        min: 0,
        max: 50,
        step: 1,
        def: 0
      },
      submitAlignment: {
        type: 'select',
        label: 'Button Alignment',
        choices: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ],
        def: 'left'
      },
      submitWidth: {
        type: 'select',
        label: 'Button Width',
        choices: [
          { label: 'Full Width', value: 'full' },
          { label: 'Fit Content', value: 'fit' },
          { label: 'Contained', value: 'contained' }
        ],
        def: 'full'
      },
      submitIcon: {
        type: 'boolean',
        label: 'Button Icon',
        def: false
      },
      submitIconType: {
        type: 'select',
        label: 'Icon Type',
        choices: [
          { label: 'SVG Code', value: 'svg' },
          { label: 'Image', value: 'image' }
        ],
        def: 'svg',
        if: { submitIcon: true }
      },
      submitIconSvg: {
        type: 'codeEditor',
        label: 'SVG Icon HTML',
        languages: [
          { label: 'HTML', value: 'html' }
        ],
        defaultLanguage: 'html',
        if: { submitIcon: true, submitIconType: 'svg' },
        required: true
      },
      submitIconImage: {
        type: 'attachment',
        label: 'Icon Image',
        fileGroup: 'images',
        if: { submitIcon: true, submitIconType: 'image' },
        required: true
      },
      submitIconPlacement: {
        type: 'select',
        label: 'Icon Placement',
        def: 'end',
        choices: [
          { label: 'Start', value: 'start' },
          { label: 'End', value: 'end' }
        ],
        if: { submitIcon: true }
      },

      // Custom attributes
      ...customAttributesSchema
    },
    group: {
      basics: {
        label: 'Form',
        fields: ['_form']
      },
      formStyles: {
        label: 'Form Styles',
        fields: [
          'formBgColor',
          'formTextColor',
          'formBorder',
          'formBorderColor',
          'formBorderWidth',
          'formBorderRadius',
          'inputBorderWidth',
          'inputBorderColor',
          'inputBorderRadius',
          'inputPlaceholderColor',
          'labelFontSize',
          'inputFontSize',
          'errorTextColor'
        ]
      },
      buttonStyles: {
        label: 'Button Styles',
        fields: [
          'submitBgColor',
          'submitTextColor',
          'submitBorder',
          'submitBorderColor',
          'submitBorderWidth',
          'submitBorderRadius',
          'submitAlignment',
          'submitWidth',
          'submitIcon',
          'submitIconType',
          'submitIconSvg',
          'submitIconImage',
          'submitIconPlacement'
        ]
      },
      customAttributes: {
        label: 'Custom Attributes',
        fields: ['customClassName', 'customId']
      }
    }
  }
};

