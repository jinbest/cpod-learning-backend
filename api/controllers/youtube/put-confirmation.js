module.exports = {


  friendlyName: 'Put confirmation',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    const moment = require('moment');

    let userContest = await UserOptions.findOne({id: inputs.id, option_key: 'youtubeContest'});

    if (userContest && userContest.option_value === 'initial') {
      await UserSiteLinks.updateOrCreate(
        {user_id: userContest.user_id, site_id: 2},
        {user_id: userContest.user_id, site_id: 2, usertype_id: 5, expiry: moment().add(60, 'days').toDate()}
        )

      return await UserOptions.updateOne({id: userContest.id}).set({option_value: 'used'});

    }

    throw 'invalid'


  }


};
