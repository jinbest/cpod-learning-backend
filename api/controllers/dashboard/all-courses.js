module.exports = {


  friendlyName: 'All courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let userId = this.req.session.userId;

    return await UserCourses.find({user_id: userId})
      .populate('course');

  }


};
