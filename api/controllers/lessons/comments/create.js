module.exports = {


  friendlyName: 'Create comment',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    commentId: {
      type: 'number',
      required: true
    },
    content: {
      type: 'ref',
      required: true
    },
    replyToId: {
      type: 'number'
    },
    replyToId2: {
      type: 'number'
    },
    userId: {
      type: 'number'
    },
    isAdmin: {
      type: 'boolean'
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (!inputs.userId) {
      throw 'invalid'
    }

    //TODO SOME VALIDATION

    let newComment = {
      parent_id: inputs.lessonId,
      content: inputs.content,
      user: inputs.userId,
    };

    if (inputs.replyToId) {
      newComment = {...newComment, ...{
        reply_to_id: inputs.replyToId ? inputs.replyToId : 0,
        reply_to_id_2: inputs.replyToId2 ? inputs.replyToId2 : 0,
        reply_to_user_id: inputs.replyToId ? (await Comments.findOne({id: inputs.replyToId}))['user'] : 0
      }}
    }
    return await Comments.create(newComment).fetch();
  }
};
