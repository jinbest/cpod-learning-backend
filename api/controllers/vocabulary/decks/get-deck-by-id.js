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
    // } else if (deck.user_id !== inputs.userId && !deck.public) {
    } else if (deck.user_id !== inputs.userId) {
      throw 'unauthorized'
    }
    let deckVocab = await UserVocabularyToVocabularyTags.find({vocabulary_tag_id: inputs.id}).select('user_vocabulary_id');

    let userVocab = await UserVocabulary.find({id: {in: deckVocab.map(vocab => vocab.user_vocabulary_id)}}).populate('vocabulary_id.v3_id',{where: {},select: ['title', 'hash_code', 'slug', 'level']});
    let userDecks = await UserVocabularyToVocabularyTags.find({user_vocabulary_id: {in: userVocab.map(vocab => vocab.id)}}).populate('vocabulary_tag_id', {where: {user_id: inputs.userId}})

    userVocab = userVocab.map(vocab => {
      let tags = userDecks.filter(deck => deck.user_vocabulary_id === vocab.id);
      if (tags && tags.length) {
        tags = tags.map(tag => tag.vocabulary_tag_id)
      }
      if (vocab.vocabulary_id && vocab.vocabulary_id.v3_id) {
        vocab.lesson = _.pick(vocab.vocabulary_id.v3_id, ['title', 'hash_code', 'slug', 'level', 'type', 'id']);
        delete vocab.vocabulary_id.v3_id
      }
      return {...vocab.vocabulary_id, ...{user_vocabulary_id: vocab.id, createdAt: vocab.createdAt, lesson: vocab.lesson, tags: tags}}
    })

    return {...deck, ...{vocab: userVocab}}

  }


};
