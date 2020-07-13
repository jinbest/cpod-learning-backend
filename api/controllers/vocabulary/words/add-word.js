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
    let lessonVocab = await VocabularyNew.findOne({id: inputs.vocabularyId});

    let existingVocab = await VocabularyNew.findOne({
      vocabulary_class: 'User Vocabulary',
      s: lessonVocab.s,
      t: lessonVocab.t,
      p: lessonVocab.p,
      en: lessonVocab.en,
      v3_id: lessonVocab.v3_id
    });

    if (existingVocab) {
      return
    }

    let newVocab;

    if (lessonVocab) {
      delete lessonVocab.id;
      lessonVocab.vocabulary_class = 'User Vocabulary';
      newVocab = await VocabularyNew.create({
        vocabulary_class: 'User Vocabulary',
        s: lessonVocab.s,
        t: lessonVocab.t,
        p: lessonVocab.p,
        en: lessonVocab.en,
        display_order: lessonVocab.display_order,
        audio: lessonVocab.audio,
        image: lessonVocab.image,
        v3_id: lessonVocab.v3_id
      }).fetch();

      let vocab = await UserVocabulary.updateOrCreate({user_id: inputs.userId, vocabulary_id: newVocab.id}, {user_id: inputs.userId, vocabulary_id: newVocab.id});

      if (inputs.deckId) {
        await UserVocabularyToVocabularyTags.updateOrCreate({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id}, {vocabulary_tag_id: inputs.deckId, user_vocabulary_id: vocab.id})
      }

      return vocab

    }

  }


};
