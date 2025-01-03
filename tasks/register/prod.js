/**
 * `tasks/register/prod.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed instead of `default` when
 * your Sails app is lifted in a production environment (e.g. using
 * `NODE_ENV=production node app`).
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/prod.js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('prod', [
    'polyfill:prod', //« Remove this to skip transpilation in production (not recommended)
    'compileAssets',
    'babel',         //« Remove this to skip transpilation in production (not recommended)
    'concat',
    'uglify',
    'cssmin',
    // 'rename', //<< Cache-busting
    // 'hash',//« Cache-busting
    // 'copy:beforeLinkBuildProd',//« For prettier URLs after cache-busting
    // 'linkAssetsBuildProd',
    // 'clean:build',
    // 'copy:build',
    // 'clean:afterBuildProd'
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:clientSideTemplates',
  ]);
};

