module.exports = {


  friendlyName: 'Create limited auth',


  description: '',


  inputs: {
    token: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    try {

      const Hashids = require('hashids/cjs');
      const hashids = new Hashids('lithographer-defeater');

      let userId = hashids.decode(inputs.token);

      userId = parseInt(userId);

      if (Number.isInteger(userId)) {
        let userData = await User.findOne({id: userId});
        this.req.session.limitedAuth = {
          id: userData.id,
          email: userData.email,
          authExpiry: new Date(Date.now() + 60 * 60 *1000)  //Limited Auth Expiry - 1 hour
        };
        sails.log.info(this.req.session.limitedAuth);
      }

    } catch (e) {

    }

    let pathParams = this.req.path.split('/');

    sails.log.info(pathParams);

    let path = pathParams.slice(0,pathParams.length - 1).join('/');
    sails.log.info(path);
    return this.res.redirect(path)

  }


};
