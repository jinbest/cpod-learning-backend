module.exports = {


  friendlyName: 'Add word to deck',


  description: '',


  inputs: {
    wordId: {
      type: 'number',
      isInteger: true,
      required: true
    },
    deckId: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    await UserVocabularyToVocabularyTags.updateOrCreate({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: inputs.wordId},{vocabulary_tag_id: inputs.deckId, user_vocabulary_id: inputs.wordId})

  }


};
