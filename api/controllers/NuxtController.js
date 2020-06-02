/**
 * NuxtController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  serve: (req, res) => {
    // Build in development
    return sails.config.nuxt.render(req, res);
  },

};

