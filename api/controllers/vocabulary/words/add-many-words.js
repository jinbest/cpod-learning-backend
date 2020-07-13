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

    let lessonVocab = await VocabularyNew.find({id: {in: inputs.vocabularyId}});

    let userVocab = await UserVocabulary.find({user_id: inputs.userId});
    let existingVocab = await VocabularyNew.find({id: {in: userVocab.map(vocab => vocab.vocabulary_id)}});

    sails.log.info('existingVocab');
    sails.log.info(existingVocab);

    if(lessonVocab) {

      lessonVocab.forEach(vocab => {
        delete vocab.id;
        vocab.display_order = 1
        vocab.vocabulary_class = 'User Vocabulary'
      });

      sails.log.info("lessonVocab");
      sails.log.info(lessonVocab);

      existingVocab.forEach(vocab => {
        delete vocab.id;
        vocab.display_order = 1
      });

      sails.log.info('existingVocab');
      sails.log.info(existingVocab);

      lessonVocab = lessonVocab.filter(vocab => !_.some(existingVocab, vocab));

      sails.log.info(lessonVocab);

      let newVocabulary = await VocabularyNew.createEach(lessonVocab).fetch();

      newVocabulary.forEach(vocab => {
        promises.push(UserVocabulary
          .updateOrCreate({user_id: inputs.userId, vocabulary_id: vocab.id}, {user_id: inputs.userId, vocabulary_id: vocab.id})
          .then(data => sails.log.info(data))
        )
      })

      await Promise.all(promises)
        .catch((e) => sails.hooks.bugsnag.notify(e));

    }

    if (inputs.deckId) {

      promises = [];
      createdVocab.forEach(vocab => {
        promises.push(
          UserVocabularyToVocabularyTags
            .updateOrCreate(
              {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id},
              {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id}
              )
        )
      });

      await Promise.all(promises)
        .catch((e) => sails.hooks.bugsnag.notify(e))
    }

  }


};
