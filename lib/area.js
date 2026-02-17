const tiptapStyles = {
  all: [
    {
      tag: 'h1',
      label: 'Heading 1 (90px)',
      class: 'h1'
    },
    {
      tag: 'h2',
      label: 'Heading 2 (67px)',
      class: 'h2'
    },
    {
      tag: 'h3',
      label: 'Heading 3 (64px)',
      class: 'h3'
    },
    {
      tag: 'h4',
      label: 'Heading 4 (47px)',
      class: 'h4'
    },
    {
      tag: 'h5',
      label: 'Heading 5 (32px)',
      class: 'h5'
    },
    {
      tag: 'h6',
      label: 'Heading 6 (26px)',
      class: 'h6'
    },
    {
      tag: 'h6',
      label: 'Small Heading (20px)',
      class: 'p1'
    },
    {
      tag: 'p',
      label: 'Paragraph-md (22px)',
      class: 'p'
    },
    {
      tag: 'p',
      label: 'Paragraph-lg (24px)',
      class: 'h7'
    },
    {
      tag: 'p',
      label: 'Paragraph-sm(18px)',
      class: 'p2'
    },
    {
      tag: 'p',
      label: 'Paragraph-xs(16px)',
      class: 'p3'
    },
    {
      tag: 'p',
      label: 'Blog Heading (67px)',
      class: 'blogheading'
    },
    {
      tag: 'span',
      label: 'Small',
      class: 'small'
    },
    {
      tag: 'span',
      label: 'Lead',
      class: 'lead'
    },
    {
      tag: 'span',
      label: 'Highlight: Primary',
      class: 'highlight-primary'
    },
    {
      tag: 'span',
      label: 'Highlight: Secondary',
      class: 'highlight-secondary'
    },
    {
      tag: 'span',
      label: 'Highlight: Tertiary',
      class: 'highlight-tertiary'
    },
    {
      tag: 'span',
      label: 'Highlight: Black',
      class: 'highlight-black'
    },
    {
      tag: 'span',
      label: 'Highlight: White',
      class: 'highlight-white'
    },
    {
      tag: 'span',
      label: 'Highlight: Yellow',
      class: 'highlight-yellow'
    },
    {
      tag: 'span',
      label: 'Highlight: Muted',
      class: 'highlight-muted'
    },
    {
      tag: 'span',
      label: 'Highlight: grey',
      class: 'highlight-grey'
    },
    {
      tag: 'span',
      label: 'Highlight: Dark Blue',
      class: 'highlight-darkblue'
    },
    {
      tag: 'span',
      label: 'Highlight: Light Black',
      class: 'highlight-lightblack'
    },
    {
      tag: 'span',
      label: 'Custom Class',
      class: 'custom-richtext-class'
    }
  ],
  simple: {}
};

const tiptapTools = {
  all: [
    'styles',
    '|',
    'bold',
    'italic',
    'strike',
    'superscript',
    'subscript',
    '|',
    'link',
    'anchor',
    'horizontalRule',
    '|',
    'bulletList',
    'orderedList',
    'blockquote',
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    'alignJustify',
    '|',
    'colorButton',
    '|',
    'image',
    'codeBlock',
    '|',
    'undo',
    'redo'
  ],
  simple: [
    'styles',
    '|',
    'bold',
    'italic',
    '|',
    'link',
    '|',
    'colorButton',
    '|',
    'bulletList',
    'orderedList'
  ]
};

const apostropheWidgets = {
  '@apostrophecms/image': {
    className: 'img-fluid'
  },
  '@apostrophecms/video': {},
  '@apostrophecms/rich-text': {
    toolbar: tiptapTools.all,
    styles: tiptapStyles.all
  }
};

const area = {
  all: {
    columns: {},
    'video-upload': {},
    'call-to-action': {},
    'custom-form': {},
    'image-gallery': {},
    product: {},
    'side-by-side': {},
    'rich-text': {},
    image: {},
    map: {},

    // Marketing widgets
    accordion: {},
    pricing: {},
    'team-member': {},

    // CTA button alias
    button: {},

    // migrated hero banner alias
    'hero-banner': {},

    // migrated progress bar slider
    'progressBar-slider': {},

    // migrated image card widget
    'image-card': {},
    // migrated testimonial widget
    'testimonial': {},
    // migrated overview card widget
    'overview-card': {},
    // migrated card widget
    card: {}
  },
  columnExpandedGroup: {
    basic: {
      label: 'Basic Tools',
      widgets: {
        image: {},
        'rich-text': {},
        columns: {}
      },
      columns: 2
    },
    layout: {
      label: 'Layout Tools',
      widgets: {
        accordion: {},
        'call-to-action': {},
        'side-by-side': {}
      },
      columns: 2
    },
    general: {
      label: 'Themed Widgets',
      widgets: {
        'custom-form': {},
        'hero-banner': {},
        button: {},
        'image-gallery': {},
        map: {},
        pricing: {},
        product: {},
        'team-member': {},
        columns: {},
        // migrated progress bar slider
        'progressBar-slider': {},
        // migrated image card widget
        'image-card': {},
        // migrated testimonial widget
        'testimonial': {},
        // migrated overview card widget
        'overview-card': {},
        // migrated specialization widget
        'specialization': {},
        // migrated services team widget
        'services-team': {},
        // migrated card widget
        card: {}
      },
      columns: 3
    }
  },
  heroBannerGroup: {
    basic: {
      label: 'Hero Banner Tools',
      widgets: {
        image: {},
        '@apostrophecms/rich-text': {
          toolbar: tiptapTools.all,
          styles: tiptapStyles.all
        },
        button: {}
      },
      columns: 2
    }
  },
  'video-upload': {},
  apos: {
    ...apostropheWidgets
  },
  richText: {
    '@apostrophecms/rich-text': {
      toolbar: tiptapTools.all,
      styles: tiptapStyles.all
    }
  },
  fullExpandedGroup: {
    layout: {
      label: 'Layout Tools',
      widgets: {
        columns: {},
        'side-by-side': {}
      },
      columns: 2
    },
    media: {
      label: 'Media Widgets',
      widgets: {
        image: {},
        '@apostrophecms/video': {},
        'image-gallery': {},
        'video-upload': {}
      },
      columns: 2
    },
    general: {
      label: 'Content Widgets',
      widgets: {
        'rich-text': {},
        accordion: {},
        'call-to-action': {},
        'custom-form': {},
        'hero-banner': {},
        button: {},
        map: {},
        pricing: {},
        product: {},
        'team-member': {},
        columns: {},
        // migrated progress bar slider
        'progressBar-slider': {},
        // migrated image card widget
        'image-card': {},
        // migrated testimonial widget
        'testimonial': {},
        // migrated overview card widget
        'overview-card': {},
        // migrated specialization widget
        'specialization': {},
        // migrated services team widget
        'services-team': {},
        // migrated card widget
        card: {}
      },
      columns: 3
    }
  }
};

module.exports = area;
