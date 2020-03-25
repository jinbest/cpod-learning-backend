module.exports = {


  friendlyName: 'Unsubscribe',


  description: 'Unsubscribe email.',


  inputs: {

    token: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

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

      return this.res.redirect('/unsubscribe')
    } else {
      return this.res.redirect('/login?continue=/unsubscribe')
    }

  }


};
