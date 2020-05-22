/**
 * RecapController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  upload: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/upload/index.html';
    fs.createReadStream(app).pipe(res)
  },
  index: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/index.html';
    fs.createReadStream(app).pipe(res)
  },
  beta: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/index-beta.html';
    fs.createReadStream(app).pipe(res)
  },
  feedback: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/feedback.html';
    fs.createReadStream(app).pipe(res)
  },
  signup: (req, res) => {
    const fs = require('fs');

    const app = __dirname + '/../../assets/recap/signup.html';
    fs.createReadStream(app).pipe(res)
  }
};

