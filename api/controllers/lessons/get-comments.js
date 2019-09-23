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

    let lessonComments = await Comments.find({parent_id: inputs.lessonId, type: 'lesson'})
      .populate('user', {select: 'username'});
      // .populate('reply_to_user_id', {where: {reply_to_id: {'!=': 0}}, select: ['username']});

    _.each(lessonComments, function (comment) {
      if (comment.reply_to_id && comment.reply_to_id > 0) {
        let parent = lessonComments.find(x => x.id === comment.reply_to_id);
        let index = lessonComments.indexOf(parent);
        if (!parent.nestedComments) {
          parent.nestedComments = [];
        }
        parent.nestedComments.push(comment);
        // delete lessonComments[lessonComments.indexOf(comment)]
      }
    });
    return {
      count: lessonComments.length,
      comments: lessonComments.filter((comment) => comment.reply_to_user_id === 0)}
  }
};
