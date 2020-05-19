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

  },


  fn: async function (inputs) {

    let promises = [];
    inputs.wordId.forEach(id => {
      promises.push(UserVocabularyToVocabularyTags.updateOrCreate({vocabulary_tag_id: inputs.deckId, user_vocabulary_id: id},{vocabulary_tag_id: inputs.deckId, user_vocabulary_id: id}))
    })

    await Promise.all(promises)

  }


};
