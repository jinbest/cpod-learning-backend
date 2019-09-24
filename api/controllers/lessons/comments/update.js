module.exports = {


  friendlyName: 'Update comment',


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

    let commentData = await Comments.findOne({id: inputs.commentId});
    if (!commentData || !inputs.userId) {
      throw 'invalid'
    }

    if (inputs.isAdmin) {
      inputs.isAdmin = await sails.helpers.users.isAdmin(inputs.userId)
    }

    if (inputs.isAdmin || inputs.userId === commentData.user) {
      return await Comments.updateOne({id: inputs.commentId})
        .set({content: inputs.content})
    } else {
      throw 'invalid'
    }
  }
};
