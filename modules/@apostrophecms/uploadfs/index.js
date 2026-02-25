module.exports = {
  options: {
    uploadfs: {
      storage: process.env.APOS_STORAGE,
      secret: process.env.APOS_S3_SECRET,
      key: process.env.APOS_S3_KEY,
      bucket: process.env.APOS_S3_BUCKET,
      region: process.env.APOS_S3_REGION,
      // Use app-name prefix: <bucket-name>/<app-name>/attachments
      // Note: uploadfs automatically adds 'attachments' subdirectory, so we only need the app name
      // Prefix needs leading slash for proper URL construction
      prefix: process.env.APOS_S3_APP_NAME 
        ? `/${process.env.APOS_S3_APP_NAME}`
        : undefined,
      params: {
        CacheControl: 'public, max-age=31536000, immutable'
      },
      // Disable ACLs for buckets that don't allow ACLs (common for buckets created after April 2023)
      acl: null
    }
  }
};
