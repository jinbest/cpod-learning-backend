module.exports = {


  friendlyName: 'Get deck by id',


  description: '',


  inputs: {
    id: {
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

    let deck = await VocabularyTags.findOne({id: inputs.id});

    if (!deck) {
      throw 'invalid'
    } else if (deck.user_id !== inputs.userId && !deck.public) {
      throw 'unauthorized'
    }
    let deckVocab = await UserVocabularyToVocabularyTags.find({vocabulary_tag_id: inputs.id}).select('user_vocabulary_id');

    let vocab = await UserVocabulary.find({id: {in: deckVocab.map(vocab => vocab.user_vocabulary_id)}}).populate('vocabulary_id');
    vocab = vocab.map(word => {
      word = {...word, ...word.vocabulary_id}
      delete word.vocabulary_id
      return word
    })

    return {...deck, ...{vocab: vocab}}

  }


};
