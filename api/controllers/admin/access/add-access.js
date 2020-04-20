module.exports = {


  friendlyName: 'Add access',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    },
    days: {
      type: 'number',
      defaultsTo: 30
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

    if (access && access === 'free') {
      let userAccess = await UserSiteLinks.updateOne({user_id: userData.id, site_id: 2})
        .set({user_id: userData.id, site_id: 2, usertype_id: 5, expiry: new Date(Date.now() + inputs.days * 24 * 60 * 60 * 1000)})

      await UserOptions.updateOrCreate({user_id: userData.id, option_key: 'tester'}, {user_id: userData.id, option_key: 'tester', option_value: true});

      return `Added ${inputs.email} to Premium List. Expires on ${userAccess.expiry.toISOString()}`

    } else {

      return `Sorry an error occurred with ${inputs.email}`

    }
  }
};
