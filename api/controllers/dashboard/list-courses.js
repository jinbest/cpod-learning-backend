module.exports = {


  friendlyName: 'All courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await UserCourses.find({user_id: inputs.userId})
      .populate('course');
  }


};
