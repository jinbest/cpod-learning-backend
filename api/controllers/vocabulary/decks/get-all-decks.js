module.exports = {


  friendlyName: 'Get all decks',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await VocabularyTags.find({user_id: inputs.userId});

  }


};
