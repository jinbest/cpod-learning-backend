module.exports = {


  friendlyName: 'User courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await UserCourses.find({
      where: {user_id: inputs.userId, course: {'>': 0}},
      select: ['default_status', 'course'],
      sort: 'updatedAt DESC'
    })
      .populate('course');
  }
};
