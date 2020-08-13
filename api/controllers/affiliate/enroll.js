module.exports = {


  friendlyName: 'Enroll',


  description: 'Enroll affiliate.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    const randtoken = require('rand-token');

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let affiliateCode;
    let affiliate = await UserOptions.findOne({user_id: inputs.userId, option_key: 'affiliate'});

    if (affiliate) {
      affiliateCode = await UserOptions.findOne({user_id: inputs.userId, option_key: 'affiliate_code'})
    } else {
      await UserOptions.create({user_id: inputs.userId, option_key: 'affiliate', option_value: 1});
    }

    if (!affiliateCode) {
      let existingCodes = await UserOptions.find({option_key: 'affiliate_code'}).select('option_value');
      existingCodes = existingCodes.map(code => code.option_value);

      function generateAffiliateCode () {
        return randtoken.generate(1, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
          + randtoken.generate(1, '0123456789')
          + randtoken.generate(1, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      }

      let affiliateCode = generateAffiliateCode();

      while(existingCodes.includes(affiliateCode)) {
        affiliateCode = generateAffiliateCode();
      }

      await UserOptions.create({user_id: inputs.userId, option_key: 'affiliate_code', option_value: affiliateCode});

    }

    //TODO: SEND SOME EMAIL?

  }


};
