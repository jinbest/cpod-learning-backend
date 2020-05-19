module.exports = {


  friendlyName: 'Add word to deck',


  description: '',


  inputs: {
    wordId: {
      type: ['ref'],
      required: true
    },
    deckId: {
      type: 'number',
      isInteger: true,
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

    let deck = await VocabularyTags.findOne({id: inputs.deckId});

    if (!deck) {
      throw 'invalid'
    } else if (deck.user_id !== inputs.userId) {
      throw 'unauthorized'
    }

    // let userVocab = await UserVocabulary.find({id: {in: inputs.wordId}, user_id: inputs.userId}).select('id')

    await UserVocabularyToVocabularyTags.destroy({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: {in: inputs.wordId}})

  }


};
