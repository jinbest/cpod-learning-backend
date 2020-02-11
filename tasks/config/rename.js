/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = function(grunt) {

  const git = require('git-rev');

  git.short(function(hash) {

    console.log(hash);

    grunt.config.set('rename', {
      js: {
        src: '.tmp/public/min/production.min.js',
        dest: '.tmp/public/min/production.v'+hash+'.min.js'
      },
      css: {
        src: '.tmp/public/min/production.min.css',
        dest: '.tmp/public/min/production.v'+hash+'.min.css'
      }
    });

  });

  grunt.loadNpmTasks('grunt-rename')

};
