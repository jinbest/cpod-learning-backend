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

    let userVocab = await UserVocabulary.find({user_id: inputs.userId}).skip(inputs.skip).limit(inputs.limit).populate('vocabulary_id').populate('vocabulary_id.v3_id',{where: {id: '0000'},select: ['title', 'hash_code', 'slug', 'level']});

    let userDecks = await UserVocabularyToVocabularyTags.find({user_vocabulary_id: {in: userVocab.map(vocab => vocab.id)}}).populate('vocabulary_tag_id', {where: {user_id: inputs.userId}})
//TODO finish this
    let amsVocab = await AmsVocabulary.find({target: {in: userVocab.map(vocab => vocab.vocabulary_id.en)}, source: {in: userVocab.map(vocab => vocab.vocabulary_id.s)}}).sort('id DESC')

    userVocab = userVocab.map(vocab => {
      let tags = userDecks.filter(deck => deck.user_vocabulary_id === vocab.id);
      if (tags && tags.length) {
        tags = tags.map(tag => tag.vocabulary_tag_id)
      }
      if (vocab.vocabulary_id && vocab.vocabulary_id.v3_id) {
        vocab.lesson = _.pick(vocab.vocabulary_id.v3_id, ['title', 'hash_code', 'slug', 'level', 'type', 'id']);
        delete vocab.vocabulary_id.v3_id
      }
      let lessonRoot = `https://s3contents.chinesepod.com/${vocab.lesson.type === 'extra' ? 'extra/' : ''}${vocab.lesson.id}/${vocab.lesson.hash_code}/`

      let audioUrlCN; let audioUrlEN;

      try {
        audioUrlCN = vocab.vocabulary_id.audio.slice(0, 4) === 'http' ? vocab.vocabulary_id.audio : lessonRoot + vocab.vocabulary_id.audio;
        let params = audioUrlCN.split('source/');
        let engAudio = amsVocab.find(ams => ams.target === vocab.vocabulary_id.en);
        if(engAudio && engAudio.target_mp3) {
          audioUrlEN = params[0] + 'translation/' + engAudio.target_mp3
        }
      } catch (e) {
        sails.hooks.bugsnag.notify(`Issue with word - ${JSON.stringify(vocab)}`);
      }

      return {...vocab.vocabulary_id, ...{user_vocabulary_id: vocab.id, createdAt: vocab.createdAt, lesson: vocab.lesson, tags: tags, audioUrlCN: audioUrlCN, audioUrlEN: audioUrlEN}}
    })

    return {
      total: total,
      vocabulary: userVocab
    }
  }

};
