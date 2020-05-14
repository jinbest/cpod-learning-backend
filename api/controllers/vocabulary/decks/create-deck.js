module.exports = {


  friendlyName: 'Create new deck',


  description: '',


  inputs: {
    tag: {
      type: 'string',
      maxLength: 255,
      required: true
    },
    public: {
      type: 'boolean'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await VocabularyTags.create({...inputs, ...{user_id: inputs.userId}}).fetch()

  }


};
