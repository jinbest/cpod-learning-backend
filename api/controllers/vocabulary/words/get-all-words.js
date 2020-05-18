module.exports = {


  friendlyName: 'Get all words',


  description: '',


  inputs: {
    skip: {
      type: 'number',
      isInteger: true
    },
    limit: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let total = await UserVocabulary.count({user_id: inputs.userId});

    let userVocab = await UserVocabulary.find({user_id: inputs.userId}).skip(inputs.skip).limit(inputs.limit).populate('vocabulary_id.v3_id',{where: {},select: ['title', 'hash_code', 'slug', 'level']});

    let userDecks = await UserVocabularyToVocabularyTags.find({user_vocabulary_id: {in: userVocab.map(vocab => vocab.id)}}).populate('vocabulary_tag_id', {where: {user_id: inputs.userId}})

    return {
      total: total,
      vocabulary: userVocab.map(vocab => {
        let tags = userDecks.filter(deck => deck.user_vocabulary_id === vocab.id);
        if (tags && tags.length) {
          vocab.vocabulary_id.tags = tags.map(tag => tag.vocabulary_tag_id)
        }
        vocab.lesson = _.pick(vocab.vocabulary_id.v3_id, ['title', 'hash_code', 'slug', 'level', 'type', 'id']);
        delete vocab.vocabulary_id.v3_id
        return {...vocab.vocabulary_id, ...{user_vocabulary_id: vocab.id, createdAt: vocab.createdAt, lesson: vocab.lesson}}
      })
    }
  }

};
