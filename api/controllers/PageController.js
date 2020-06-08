/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  serve: (req, res) => {
    // Build in development
    if(req.session && req.session.userId) {
      const fs = require('fs');
      const app = __dirname + '/../../assets/home/index.html';
      fs.createReadStream(app).pipe(res)
    }

    sails.log.info(req.path);

    return sails.config.nuxt.render(req, res);
  },

};

