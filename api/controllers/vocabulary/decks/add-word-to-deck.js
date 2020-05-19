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
    
    let promises = [];
    inputs.wordId.forEach(id => {
      promises.push(UserVocabularyToVocabularyTags.updateOrCreate({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: id},{vocabulary_tag_id: inputs.deckId, user_vocabulary_id: id}))
    })

    await Promise.all(promises)

  }


};
