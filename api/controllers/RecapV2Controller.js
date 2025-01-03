/**
 * RecapController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  serve: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/upload-files-v2/index.html';
    fs.createReadStream(app).pipe(res)
  }
};

