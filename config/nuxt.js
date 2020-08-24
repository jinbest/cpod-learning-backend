/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

/**
 * nuxt config and init
 */

if (process.env.NODE_ENV !== 'production'){

  module.exports = {}

} else {

  const { Nuxt } = require('nuxt');

// Require Nuxt config
  const config = require('../nuxt.config');

// Create a new Nuxt instance
  const nuxt = new Nuxt(config);

// Enable live build & reloading on dev
// if (nuxt.options.dev) {
//   new Builder(nuxt).build();
// }

  module.exports = { nuxt };
}

