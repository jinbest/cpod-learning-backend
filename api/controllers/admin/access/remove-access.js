module.exports = {


  friendlyName: 'Add access',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    let userData = await User.findOne({email: inputs.email});

    if (!userData) {
      throw 'invalid'
    }

    let access = await sails.helpers.users.getAccessType(userData.id);

    if (access) {
      let userAccess = await UserSiteLinks.updateOne({user_id: userData.id, site_id: 2})
        .set({user_id: userData.id, site_id: 2, usertype_id: 7, expiry: new Date()});

      await UserOptions.updateOrCreate({user_id: userData.id, option_key: 'tester'}, {user_id: userData.id, option_key: 'tester', option_value: false});

      return `Removed ${inputs.email} from Premium List. Expires on ${userAccess.expiry.toISOString()}`

    }
  }
};
