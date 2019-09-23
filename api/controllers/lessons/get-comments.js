module.exports = {


  friendlyName: 'Get comments',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    return await Comments.find({parent_id: inputs.lessonId, type: 'lesson'})
      .populate('user_id', {select: 'username'})
      // .populate('reply_to_user_id', {where: {reply_to_id: {'!=': 0}}, select: ['username']});

  }
};
