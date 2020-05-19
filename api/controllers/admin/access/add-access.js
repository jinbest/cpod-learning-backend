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
      return `Sorry no such user with email ${inputs.email}`
    }

    let access = await sails.helpers.users.getAccessType(userData.id);

    if (access && access === 'free') {
      let userAccess = await UserSiteLinks.updateOne({user_id: userData.id, site_id: 2})
        .set({user_id: userData.id, site_id: 2, usertype_id: 5, expiry: new Date(Date.now() + inputs.days * 24 * 60 * 60 * 1000)})

      await UserOptions.updateOrCreate({user_id: userData.id, option_key: 'tester'}, {user_id: userData.id, option_key: 'tester', option_value: true});

      return `Added ${inputs.email} to Premium List. Expires on ${userAccess.expiry.toISOString()}`

    } else {

      let userAccess;
      try {
        userAccess = await UserSiteLinks.findOne({user_id: userData.id, site_id: 2})
      } catch (e) {

      }
      if (!userAccess) {
        return `User with email ${inputs.email} already has ${access} access`
      } else {
        return `User with email ${inputs.email} already has ${access} access that expires on ${new Date(userAccess.expiry).toISOString()}`
      }

    }
  }
};
