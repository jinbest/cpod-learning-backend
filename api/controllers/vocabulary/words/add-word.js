module.exports = {


  friendlyName: 'Add word',


  description: '',


  inputs: {
    vocabularyId: {
      type: 'number',
      isInteger: true,
      required: true
    },
    deckId: {
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

    if (inputs.deckId) {

      let deck = await VocabularyTags.findOne({id: inputs.id});

      if (!deck) {
        throw 'invalid'
      } else if (deck.user_id !== inputs.userId) {
        throw 'unauthorized'
      }

    }

    let vocab = await UserVocabulary.create({user_id: inputs.userId, vocabulary_id: inputs.vocabularyId}).fetch();

    if (inputs.deckId) {
      await UserVocabularyToVocabularyTags.create({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id})
    }

    return vocab

  }


};
