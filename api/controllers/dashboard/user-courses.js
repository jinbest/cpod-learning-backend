module.exports = {


  friendlyName: 'User courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let userId = '1016995';

    return await UserCourses.find({
      where: {user_id: userId},
      select: ['course'],
      sort: 'updatedAt DESC'
    })
      .populate('course');

  }


};
