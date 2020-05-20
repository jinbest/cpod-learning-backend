module.exports = {


  friendlyName: 'Add word',


  description: '',


  inputs: {
    vocabularyId: {
      type: ['ref'],
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

    let promises = [];
    let createdVocab = [];

    sails.log.info(inputs)

    inputs.vocabularyId.forEach(vocabId => {
      promises.push(UserVocabulary.updateOrCreate({user_id: inputs.userId, vocabulary_id: vocabId}, {user_id: inputs.userId, vocabulary_id: vocabId})
        .then(console.log))
    })

    sails.log.info(createdVocab)

    await Promise.all(promises)
      .catch((e) => sails.hooks.bugsnag.notify(e));

    sails.log.info(createdVocab);

    if (inputs.deckId) {

      promises = [];
      createdVocab.forEach(vocab => {
        promises.push(UserVocabularyToVocabularyTags.updateOrCreate({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id}, {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id}))
      });

      await Promise.all(promises)
        .catch((e) => sails.hooks.bugsnag.notify(e))
    }

  }


};
