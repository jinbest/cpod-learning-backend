module.exports = {


  friendlyName: 'Post user data',


  description: '',


  inputs: {
    email: {
      type: 'string',
      isEmail: true,
      description: 'The email address of the user account, e.g. m@example.com.',
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    let userData = await User.findOne({email: inputs.email});

    //TODO: Implement User Does Not Exist Option
    if (!userData) {
      throw 'invalid'
    }

    let userContest = await UserOptions.findOne({user_id: userData.id, option_key: 'youtubeContest'});

    if (!userContest) {
      userContest = await UserOptions.create({user_id: userData.id, option_key: 'youtubeContest', option_value: 'initial'});
    }

    userContest.createdAt = userContest.updatedAt;

    sails.log.info(userContest);

    return userContest

  }


};
