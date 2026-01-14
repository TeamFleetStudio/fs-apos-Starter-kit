require('dotenv').config();

const DEFAULT_PORT = 3000;

async function startApp() {
  // ---------------------------------------------
  // Port handling 
  // ---------------------------------------------
  let port = process.env.PORT || DEFAULT_PORT;

  if (process.env.NODE_ENV !== 'production') {
    const detectPort = require('detect-port').default || require('detect-port');
    const detectedPort = await detectPort(DEFAULT_PORT);

    if (detectedPort !== DEFAULT_PORT) {
      console.log(`\n⚠️  Port ${DEFAULT_PORT} is in use, starting on ${detectedPort}\n`);
    } else {
      console.log(`\n🚀 Starting on ${detectedPort}\n`);
    }

    port = detectedPort;
  }

  process.env.PORT = port;
  const appName = 'a3-starter-kit-marketing';
  const baseUrl = process.env.APOS_BASE_URL || `http://localhost:${port}`;

  if (!process.env.APOS_MONGODB_URI) {
    throw new Error(
      'APOS_MONGODB_URI is missing. Add it to your app .env (include /<dbName>?authSource=admin&tls=false).'
    );
  }

  console.log('\n🔗 MongoDB URI being used (from .env):');
  console.log(process.env.APOS_MONGODB_URI);
  console.log('');

  // ---------------------------------------------
  // Start Apostrophe
  // ---------------------------------------------
  require('apostrophe')({
    shortName: appName,
    baseUrl,
    nestedModuleSubdirs: true,
    modules: {
      '@apostrophecms/rich-text-widget': {},
      '@apostrophecms/image-widget': {
        options: { className: 'img-fluid' }
      },
      '@apostrophecms/video-widget': {},

      '@apostrophecms/form': {
        options: { shortcut: 'a,f' }
      },
      '@apostrophecms/form-widget': {},
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
          excludeTypes: ['team-member', 'product']
        }
      },
      '@apostrophecms/seo': {},
      '@apostrophecms/open-graph': {},

      helper: {},
      asset: {},
      settings: {},

      'default-page': {},
      'content-widget-modules': {
        options: { ignoreNoCodeWarning: true }
      },
      'pieces-modules': {
        options: { ignoreNoCodeWarning: true }
      }
    }
  });
}

startApp().catch((err) => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});
