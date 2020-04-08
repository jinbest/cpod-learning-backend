/**
 * SwaggerOldController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const auth = require('basic-auth');
const developers = sails.config.custom.developers;

module.exports = {
  serve: (req, res) => {

    var user = auth(req);

    sails.log.info(user);

    if (!user || !developers[user.name] || developers[user.name].password !== user.pass) {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      return res.status(401).send()
    }

    const fs = require('fs');

    const app = __dirname + '/../../assets/swagger-old/index.html';
    fs.createReadStream(app).pipe(res)
  }
};

