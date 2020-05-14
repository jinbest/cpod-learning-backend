module.exports = {


  friendlyName: 'Get all words',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userVocab = await UserVocabulary.find({user_id: inputs.userId}).populate('vocabulary_id');

    let userDecks = await UserVocabularyToVocabularyTags.find({user_vocabulary_id: {in: userVocab.map(vocab => vocab.id)}}).populate('vocabulary_tag_id')

    return userVocab.map(vocab => {
      let tags = userDecks.filter(deck => deck.user_vocabulary_id === vocab.id);
      if (tags && tags.length) {
        vocab.vocabulary_id.tags = tags.map(tag => tag.vocabulary_tag_id)
      }
      return {...vocab.vocabulary_id, ...{user_vocabulary_id: vocab.id}}
    })
  }

};
