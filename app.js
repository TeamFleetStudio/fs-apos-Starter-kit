const path = require('path');
// Load .env from root monorepo directory (two levels up from app directory)
const rootDir = path.resolve(__dirname, '../..');
require('dotenv').config({ path: path.join(rootDir, '.env') });

const DEFAULT_PORT = 3000;

async function startApp() {
  let port = process.env.PORT || DEFAULT_PORT;

  // Auto-detect available port in development only
  if (process.env.NODE_ENV !== 'production') {
    const detectPort = require('detect-port').default || require('detect-port');
    const detectedPort = await detectPort(DEFAULT_PORT);

    if (detectedPort !== DEFAULT_PORT) {
      console.log(`\n⚠️  Port ${DEFAULT_PORT} is in use, starting on port ${detectedPort}\n`);
    } else {
      console.log(`\n🚀 Starting on port ${detectedPort}\n`);
    }

    port = detectedPort;
  }

  // Set PORT env var for ApostropheCMS to pick up
  process.env.PORT = port;

  // Build baseUrl dynamically
  const baseUrl = process.env.APOS_BASE_URL || `http://localhost:${port}`;

  // Log MongoDB URI (mask credentials for security)
  const appName = 'Thanush-test';
  const shortName = appName.toLowerCase();
  const mongoURI = process.env.APOS_MONGODB_URI + '/' + shortName;
  if (mongoURI) {
    // Mask credentials in URI: mongodb://user:pass@host -> mongodb://***:***@host
    // const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    // console.log(`\n🔗 APOS_MONGODB_URI: ${mongoURI}\n`); 
  } else {
    console.log('\n⚠️  APOS_MONGODB_URI not set in environment variables\n');
  }

  require('apostrophe')({
    shortName: shortName,
    baseUrl,
    nestedModuleSubdirs: true,
    modules: {
      '@apostrophecms/db': {
        options: {
          uri: mongoURI
        }
      },
      // Apostrophe module configuration
      // *******************************
      //
      // NOTE: most configuration occurs in the respective modules' directories.
      // See modules/@apostrophecms/page/index.js for an example.
      //
      // Any modules that are not present by default in Apostrophe must at least
      // have a minimal configuration here to turn them on: `moduleName: {}`
      // ***********************************************************************
      // `className` options set custom CSS classes for Apostrophe core widgets.
      '@apostrophecms/rich-text-widget': {
        options: {}
      },
      '@apostrophecms/image-widget': {
        options: {
          className: 'img-fluid'
        }
      },
      '@apostrophecms/video-widget': {
        options: {}
      },

      // The main form module
      '@apostrophecms/form': {
        options: {
          shortcut: 'a,f'
        }
      },
      // The form widget module, allowing editors to add forms to content areas
      '@apostrophecms/form-widget': {},
      // Form field widgets, used by the main form module to build forms.
      '@apostrophecms/form-text-field-widget': {},
      '@apostrophecms/form-textarea-field-widget': {},
      '@apostrophecms/form-select-field-widget': {},
      '@apostrophecms/form-radio-field-widget': {},
      '@apostrophecms/form-file-field-widget': {},
      '@apostrophecms/form-checkboxes-field-widget': {},
      '@apostrophecms/form-boolean-field-widget': {},
      '@apostrophecms/form-conditional-widget': {},

      '@apostrophecms/sitemap': {
        options: {
          excludeTypes: [ 'team-member', 'product' ]
        }
      },
      '@apostrophecms/seo': {},
      '@apostrophecms/open-graph': {},

      // `asset` supports the project's webpack build for client-side assets.
      helper: {},
      asset: {},
      settings: {},

      // The project's first custom page type.
      'default-page': {},
      'content-widget-modules': {
        options: {
          ignoreNoCodeWarning: true
        }
      },
      'pieces-modules': {
        options: {
          ignoreNoCodeWarning: true
        }
      }
    }
  });
}

startApp();
