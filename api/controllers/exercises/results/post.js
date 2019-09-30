module.exports = {


  friendlyName: 'Post',


  description: 'Post results.',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'number'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    // All done.
    return;

  }


};
