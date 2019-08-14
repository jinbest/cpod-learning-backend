module.exports = {


  friendlyName: 'All courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let userId = '1016995';

    return await UserCourses.find({user_id: userId})
      .populate('course');

  }


};
