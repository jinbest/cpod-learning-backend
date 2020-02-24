module.exports = {


  friendlyName: 'Create limited auth',


  description: '',


  inputs: {
    token: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    const Hashids = require('hashids/cjs');
    const hashids = new Hashids('lithographer-defeater');

    let userId = hashids.decode(inputs.token);

    sails.log.info(userId);
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

    sails.log.info(this.req.session);

    let path = this.req.path.split('/').slice(0,2).join('/');

    return this.res.redirect(path)


  }


};
