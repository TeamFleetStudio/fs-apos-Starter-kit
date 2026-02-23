/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    './views/**/*.{html,js}', 
    './modules/**/*.{html,js}', 
    './modules/**/**/*.{html,js}', 
    './modules/**/**/**/*.{html,js}',
    './lib/**/*.{html,js}'
  ],
  safelist: [
    // Safelist commonly used utility classes for CMS widgetClass
    // Rebuild once, then any of these classes work forever without rebuilds
    
    // Spacing - margins & padding (0-96)
    { pattern: /^[mp][trblxy]?-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/ },
    
    // Widths & Heights
    { pattern: /^(w|h|min-w|min-h|max-w|max-h)-(0|px|0\.5|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96|auto|full|screen|min|max|fit)$/ },
    // Widths & Heights with max-width variants (max-sm:, max-md:, etc.)
    { 
      pattern: /^(w|h|min-w|min-h|max-w|max-h)-(0|px|0\.5|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96|auto|full|screen|min|max|fit)$/, 
      variants: ['max-sm', 'max-md', 'max-lg', 'max-xl', 'max-2xl']
    },
    
    // Colors - text, background, border with standard colors
    { pattern: /^(text|bg|border)-(white|black|transparent|current|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    
    // Flexbox & Grid
    { pattern: /^(flex|inline-flex|grid|inline-grid)$/ },
    { pattern: /^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap|1|auto|initial|none)$/ },
    { pattern: /^(justify|items|content|self)-(start|end|center|between|around|evenly|stretch|baseline|auto)$/ },
    { pattern: /^gap-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48)$/ },
    { pattern: /^(grid-cols|grid-rows)-(1|2|3|4|5|6|7|8|9|10|11|12|none)$/ },
    
    // Display & Position
    { pattern: /^(block|inline-block|inline|hidden|table|table-row|table-cell)$/ },
    { pattern: /^(static|fixed|absolute|relative|sticky)$/ },
    { pattern: /^(top|right|bottom|left|inset)-(0|px|0\.5|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|auto|full)$/ },
    
    // Typography
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/ },
    { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/ },
    { pattern: /^(text-left|text-center|text-right|text-justify)$/ },
    { pattern: /^(leading|tracking)-(none|tighter|tight|normal|relaxed|loose|looser|wider|widest)$/ },
    { pattern: /^(underline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case)$/ },
    
    // Borders & Rounded
    { pattern: /^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/ },
    { pattern: /^rounded-(t|r|b|l|tl|tr|br|bl)(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/ },
    { pattern: /^border(-[0248])?$/ },
    { pattern: /^border-(t|r|b|l|x|y)(-[0248])?$/ },
    
    // Shadows & Effects
    { pattern: /^shadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?$/ },
    { pattern: /^opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/ },
    
    // Z-index
    { pattern: /^z-(0|10|20|30|40|50|auto)$/ },
    
    // Overflow
    { pattern: /^overflow-(auto|hidden|visible|scroll|x-auto|x-hidden|x-visible|x-scroll|y-auto|y-hidden|y-visible|y-scroll)$/ },
    
    // Spacing with responsive variants
    { 
      pattern: /^[mp][trblxy]?-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/, 
      variants: ['sm', 'md', 'lg', 'xl', '2xl', 'hover', 'focus']
    },
    
    // Display & layout with responsive variants
    { 
      pattern: /^(flex|inline-flex|grid|inline-grid|block|inline-block|hidden)$/, 
      variants: ['sm', 'md', 'lg', 'xl', '2xl']
    },
    
    // Text alignment with responsive variants
    { 
      pattern: /^(text-left|text-center|text-right|text-justify)$/, 
      variants: ['sm', 'md', 'lg', 'xl', '2xl']
    }
  ],
  theme: {
    extend: {
      // You can extend the theme here with custom colors, spacing, etc.
      // This allows you to keep your existing design system while using Tailwind
    }
  },
  corePlugins: {
    // Disable container plugin if you're using custom container classes
    // container: false
  },
  plugins: []
};
