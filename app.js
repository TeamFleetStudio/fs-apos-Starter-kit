const path = require('path');
const { MongoClient } = require('mongodb');

// ----------------------------------------------------
// Load .env from monorepo root
// ----------------------------------------------------
const rootDir = path.resolve(__dirname, '../..');
require('dotenv').config({ path: path.join(rootDir, '.env') });

const DEFAULT_PORT = 3000;

// ----------------------------------------------------
// Ensure MongoDB database exists (forces creation)
// ----------------------------------------------------
async function ensureDbExists(uri) {
  const client = new MongoClient(uri);
  await client.connect();

  const url = new URL(uri);
  const dbName = url.pathname.replace(/^\//, '') || 'test';

  const db = client.db(dbName);
  await db.collection('__apos_init').insertOne({
    createdAt: new Date()
  });

  await client.close();
}

// ----------------------------------------------------
// Start Apostrophe app
// ----------------------------------------------------
async function startApp() {
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

  const baseUrl = process.env.APOS_BASE_URL || `http://localhost:${port}`;

  // ----------------------------------------------------
  // App name → DB name
  // ----------------------------------------------------
  const appName = 'a3-starter-kit-marketing';
  const shortName = appName.toLowerCase();

  // ----------------------------------------------------
  // Build Mongo URI correctly
  // ----------------------------------------------------
  const u = new URL(process.env.APOS_MONGODB_URI);
  u.pathname = `/${shortName}`;
  const mongoURI = u.toString();

  console.log('\n🔗 MongoDB URI being used:');
  console.log(mongoURI);
  console.log('📦 Expected DB:', shortName, '\n');

  // ----------------------------------------------------
  // Force DB creation (no more "test" confusion)
  // ----------------------------------------------------
  await ensureDbExists(mongoURI);

  // ----------------------------------------------------
  // Start Apostrophe
  // ----------------------------------------------------
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
          excludeTypes: [ 'team-member', 'product' ]
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

startApp().catch(err => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});
