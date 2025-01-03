/**
 * File Upload Settings
 * (sails.config.uploads)
 *
 * These options tell Sails where (and how) to store uploaded files.
 *
 *  > This file is mainly useful for configuring how file uploads in your
 *  > work during development; for example, when lifting on your laptop.
 *  > For recommended production settings, see `config/env/production.js`
 *
 * For all available options, see:
 * https://sailsjs.com/config/uploads
 */

module.exports.uploads = {

  /***************************************************************************
   *                                                                          *
   * Sails apps upload and download to the local disk filesystem by default,  *
   * using a built-in filesystem adapter called `skipper-disk`. This feature  *
   * is mainly intended for convenience during development since, in          *
   * production, many apps will opt to use a different approach for storing   *
   * uploaded files, such as Amazon S3, Azure, or GridFS.                     *
   *                                                                          *
   * Most of the time, the following options should not be changed.           *
   * (Instead, you might want to have a look at `config/env/production.js`.)  *
   *                                                                          *
   ***************************************************************************/
  // dirpath: '.tmp/uploads',

  /***************************************************************************
   *                                                                          *
   * Configure a production filesystem adapter:                               *
   *                                                                          *
   * 1. Choose an adapter:                                                    *
   *    https://sailsjs.com/plugins/uploads                                   *
   *                                                                          *
   * 2. Install it as a dependency of your Sails app.                         *
   *    (For example:  npm install skipper-s3 --save)                         *
   *                                                                          *
   * 3. Then pass it in, with any other config.                               *
   *    (See https://sailsjs.com/config/uploads for help.)                    *
   *                                                                          *
   ***************************************************************************/
  adapter: require('skipper-s3'),
};
