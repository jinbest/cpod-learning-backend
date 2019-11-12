/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  serve: (req, res) => {
    const fs = require('fs');

    this.res.cookie('new_dashboard', true, {
      domain: '.chinesepod.com',
      expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
    });

    const app = __dirname + '/../../assets/home/index.html';
    fs.createReadStream(app).pipe(res)
  }
};

