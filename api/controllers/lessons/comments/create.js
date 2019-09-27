module.exports = {


  friendlyName: 'Create comment',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
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
      content: inputs.content.toString(),
      user: inputs.userId,
    };

    if (inputs.replyToId) {
      const replyToComment = await Comments.updateOne(inputs.replyToId).set({reply_count: 1});
      if (!replyToComment) {
        throw 'invalid'
      }
      newComment = {...newComment, ...{
        reply_to_id: inputs.replyToId ? inputs.replyToId : 0,
        reply_to_id_2: inputs.replyToId2 ? inputs.replyToId2 : 0,
        reply_to_user_id: inputs.replyToId ? replyToComment['user'] : 0
      }};
      // await Comments.updateOne({id: inputs.replyToId).set({reply_count: replyToComment.reply_count + 1})
    }
    sails.log.info({comment: newComment, commentSaved:  await Comments.create(newComment).fetch()});
    // return await Comments.create(newComment).fetch();
  }
};
