module.exports = {


  friendlyName: 'Delete word',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true
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

    let vocab = await UserVocabulary.findOne({id: inputs.id});

    if (!vocab) {
      throw 'invalid'
    } else if (vocab.user_id !== inputs.userId) {
      throw 'unauthorized'
    }

    let destroyedWord = await UserVocabulary.destroyOne({id: inputs.id});
    await UserVocabularyToVocabularyTags.destroy({user_vocabulary_id: inputs.id})
    await VocabularyNew.destroyOne({id: destroyedWord.vocabulary_id, vocabulary_class: {in: ['User Vocabulary', 'User Sentence']}});

  }


};
