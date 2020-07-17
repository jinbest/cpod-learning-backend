module.exports = {


  friendlyName: 'Post user data',


  description: '',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'User identifier token'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    const Hashids = require('hashids/cjs');
    const hashids = new Hashids('lithographer-defeater');

    let userId = hashids.decode(inputs.token);

    userId = parseInt(userId);

    if (!Number.isInteger(userId)) {
      throw 'invalid'
    }

    let userData = await User.findOne({id: userId});
    //
    // let userData = await User.findOne({email: inputs.email});

    if (!userData) {
      throw 'invalid'
    }

    let userContest = await UserOptions.findOne({user_id: userData.id, option_key: 'youtubeContest'});

    if (!userContest) {
      userContest = await UserOptions.create({user_id: userData.id, option_key: 'youtubeContest', option_value: 'initial'});
    }

    userContest.createdAt = userContest.updatedAt;

    sails.log.info(userContest);

    return {...userContest, ...{email: userData.email}}

  }


};
