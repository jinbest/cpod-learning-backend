module.exports = {


  friendlyName: 'Get leads',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let affiliateId = await UserOptions.findOne({user_id: inputs.userId, option_key: 'affiliate_code'});

    let affiliateCodes = [];
    affiliateCodes.push(inputs.userId);

    if (affiliateId) {
      affiliateCodes.push(affiliateId.option_value);
    }

    let fullAffiliates = await AffiliateLogs.find({
      affiliate_id: {'in': affiliateCodes}
    }).select(['id', 'createdAt', 'user_id', 'ip_address', 'ip_country'])

    let uniques = _.uniq(fullAffiliates, (a) => a.user_id)

    uniques.forEach(affiliate => {
      if (affiliate.ip_address) {
        affiliate.ip_address = affiliate.ip_address.split('.')[0] + '.***.***.***'
      }
      if (affiliate.user_id) {

        let annonymousId = ''; let userIdArray = affiliate.user_id.toString().split('');
        annonymousId += userIdArray[0];
        annonymousId += userIdArray[1];

        for (let i = 0; i < userIdArray.length - 2; i++) {
          annonymousId += '*';
        }

        affiliate.user_id = annonymousId;

      }
    })

    return uniques

  }


};
