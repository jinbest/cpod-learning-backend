module.exports = {


  friendlyName: 'Is admin',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    let userAccess = await UserSiteLinks.find({
      where: {user_id: inputs.userId, site_id: 2},
      select: ['usertype_id'],
      sort: 'createdAt DESC',
      limit: 1
    });

    return userAccess[0].usertype_id === 1
  }


};

