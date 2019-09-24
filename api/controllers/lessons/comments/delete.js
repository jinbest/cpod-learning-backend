module.exports = {


  friendlyName: 'Delete comment',


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
      return await Comments.destroyOne({id: inputs.commentId})
    } else {
      throw 'invalid'
    }
  }
};
