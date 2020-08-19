/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

/**
 * nuxt config and init
 */
const { Nuxt } = require('nuxt');

// Require Nuxt config
const config = require('../nuxt.config');

config.env.API_URL = 'http://localhost:1337/api/v1'
// Create a new Nuxt instance
const nuxt = new Nuxt(config);

// // Enable live build & reloading on dev
// if (nuxt.options.dev) {
//   new Builder(nuxt).build();
// }

module.exports = { nuxt };
