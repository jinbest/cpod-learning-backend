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

    sails.log.info(inputs)

    let vocab = await UserVocabulary.find({id: {in: inputs.wordId}, user_id: inputs.userId});

    if (!vocab || !vocab.length) {
      throw 'invalid'
    }

    let destroyedVocab = await UserVocabulary.destroy({id: {in: inputs.wordId}, user_id: inputs.userId}).fetch();
    await UserVocabularyToVocabularyTags.destroy({user_vocabulary_id: {in: inputs.wordId}});
    await VocabularyNew.destroy({id: {in: destroyedVocab.map(vocab => vocab.vocabulary_id)}, vocabulary_class: {in: ['User Vocabulary', 'User Sentence']}});

  }


};
