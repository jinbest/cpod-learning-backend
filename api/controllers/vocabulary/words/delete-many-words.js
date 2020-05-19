module.exports = {


  friendlyName: 'Delete word',


  description: '',


  inputs: {
    wordId: {
      type: ['ref'],
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    },
    unauthorized: {
      responseType: 'unauthorized'
    }
  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let vocab = await UserVocabulary.find({id: {in: inputs.wordId}, user_id: inputs.userId});

    if (!vocab || !vocab.length) {
      throw 'invalid'
    }

    await UserVocabulary.destroy({id: {in: inputs.wordId}, user_id: inputs.userId});
    await UserVocabularyToVocabularyTags.destroy({user_vocabulary_id: {in: inputs.wordId}})

  }


};
