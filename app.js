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
      console.log(`\nPort ${DEFAULT_PORT} is in use, starting on ${detectedPort}\n`);
    } else {
      console.log(`\nStarting on ${detectedPort}\n`);
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

  console.log('\nMongoDB URI being used (from .env):');
  console.log(process.env.APOS_MONGODB_URI);
  console.log('');

  // ---------------------------------------------
  // Start Apostrophe 
  // (NOTE : should not remove the comment for block START and END, 
  // Because, that is used to target this block to sync the code 
  // with the app.js file of the app instance, from the shared resources folder )
  // ---------------------------------------------
  // FS_SYNC_APOS_CONFIG_START
  require('apostrophe')({
    shortName: appName,
    baseUrl,
    nestedModuleSubdirs: true,
    options: {
      uploadfs: {
        storage: 's3',
        secret: process.env.APOS_S3_SECRET,
        key: process.env.APOS_S3_KEY,
        bucket: process.env.APOS_S3_BUCKET,
        region: process.env.APOS_S3_REGION,
        contentTypes: {
          'video/mp4': 'mp4',
          'video/webm': 'webm',
        },
        params: {
          CacheControl: 'public, max-age=31536000, immutable'
        },
        // Disable ACLs for buckets that don't allow ACLs (common for buckets created after April 2023)
        acl: null,
        optimize: true,
      },
    },
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
      },
      'code-editor-field': {},
      'rich-text-color': {},
      'rich-text-font': {},
      blog: {},
      'blog-page': {},
      media: {},
      'media-page': {},
      'product-digest': {},
      'product-digest-page': {}
    },
    bundles: ['@bodonkey/rich-text-enhancement']
  });
  // FS_SYNC_APOS_CONFIG_END
}

startApp().catch((err) => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
