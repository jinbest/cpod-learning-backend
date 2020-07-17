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

    let promises = [];
    userVocab.forEach(vocab => {
      if(vocab.vocabulary_id && vocab.vocabulary_id.audio) {
        promises.push(
          AmsVocabulary.find({source_mp3: vocab.vocabulary_id.audio.split('source/').pop()}).limit(1)
          .then(data => {return data[0]})
        )
      }
    })

    let amsVocab = [].concat(...(await Promise.all(promises)));

    userVocab = userVocab.map(vocab => {
      let tags = userDecks.filter(deck => deck.user_vocabulary_id === vocab.id);
      if (tags && tags.length) {
        tags = tags.map(tag => tag.vocabulary_tag_id)
      }
      if (vocab.vocabulary_id && vocab.vocabulary_id.v3_id) {
        vocab.lesson = _.pick(vocab.vocabulary_id.v3_id, ['title', 'hash_code', 'slug', 'level', 'type', 'id']);
        delete vocab.vocabulary_id.v3_id
      }


      let audioUrlCN; let audioUrlEN;

      if (vocab.lesson && vocab.vocabulary_id.audio) {
        let lessonRoot = `https://s3contents.chinesepod.com/${vocab.lesson.type === 'extra' ? 'extra/' : ''}${vocab.lesson.id}/${vocab.lesson.hash_code}/`

        try {
          audioUrlCN = vocab.vocabulary_id.audio.slice(0, 4) === 'http' ? vocab.vocabulary_id.audio : lessonRoot + vocab.vocabulary_id.audio;
          let params = audioUrlCN.split('source/');

          let amsObj = amsVocab.find(ams => ams && ams.source_mp3 === params[params.length - 1])

          if(amsObj && amsObj.target_mp3) {
            audioUrlEN = params[0] + 'translation/' + amsObj.target_mp3
          }
        } catch (e) {
          // sails.log.error(e);
          sails.hooks.bugsnag.notify(`Issue with word - ${JSON.stringify(vocab)}`);
        }

        if (audioUrlCN) {
          audioUrlCN = audioUrlCN.replace('http:', 'https:')
        }
        if (audioUrlEN) {
          audioUrlEN = audioUrlEN.replace('http:', 'https:')
        }

      }

      return {...vocab.vocabulary_id, ...{user_vocabulary_id: vocab.id, createdAt: vocab.createdAt, lesson: vocab.lesson, tags: tags, audioUrlCN: audioUrlCN, audioUrlEN: audioUrlEN}}
    })

    return {
      total: total,
      vocabulary: userVocab
    }
  }

};
