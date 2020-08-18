module.exports = {


  friendlyName: 'Get User access Type',


  description: '',


  inputs: {

    userId: {
      type: 'number',
      description: 'User ID from the Database',
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },
    invalid: {
      description: 'The provided ID does not match a valid user.'
    },

  },


  fn: async function (inputs) {
    function accessMap(level) {
      switch (level) {
        case 1:
          return 'admin';
        case 5:
          return 'premium';
        case 6:
          return 'basic';
        case 7:
          return 'free';
        default:
          return 'free';
      }
    }

    let userAccess = (await UserSiteLinks.find({user_id: inputs.userId, site_id: 2}).limit(1))[0];
    if (userAccess && userAccess.usertype_id) {
      return {type: accessMap(userAccess.usertype_id), expiry: userAccess.expiry}
    } else {
      return {type: 'free', expiry: new Date()}
    }
  }
};

