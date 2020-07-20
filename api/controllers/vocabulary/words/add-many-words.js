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

    let lessonVocab = await VocabularyNew.find({id: {in: inputs.vocabularyId}});

    if(lessonVocab) {

      lessonVocab.forEach(vocab => {
        delete vocab.id;
        vocab.vocabulary_class = 'User Vocabulary'
      })

      let newVocabulary = await VocabularyNew.createEach(lessonVocab).fetch();

      newVocabulary.forEach(vocab => {
        promises.push(UserVocabulary.updateOrCreate({user_id: inputs.userId, vocabulary_id: vocab.id}, {user_id: inputs.userId, vocabulary_id: vocab.id})
          .then(console.log))
      })

      let createdVocab = await Promise.all(promises)
        .catch((e) => sails.hooks.bugsnag.notify(e));

      if (inputs.deckId && createdVocab && createdVocab.length) {
        promises = [];
        createdVocab.forEach(vocab => {
          promises.push(
            UserVocabularyToVocabularyTags.updateOrCreate(
              {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id},
              {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id}
            )
          )
        });
        await Promise.all(promises)
          .catch((e) => sails.hooks.bugsnag.notify(e))
      }
    }



  }


};
