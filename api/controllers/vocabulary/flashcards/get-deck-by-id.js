module.exports = {


  friendlyName: 'Get deck by id',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true
    },
    skip: {
      type: 'number',
      isInteger: true
    },
    limit: {
      type: 'number',
      isInteger: true
    },
    english: {
      type: 'boolean'
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

    let userVocab = await UserVocabulary
      .find({id: {in: deckVocab.map(vocab => vocab.user_vocabulary_id)}})
      .sort('createdAt DESC')
      .limit(inputs.limit)
      .populate('vocabulary_id.v3_id',{where: {},select: ['title', 'hash_code', 'slug', 'level']});

    let userDecks = await UserVocabularyToVocabularyTags
      .find({user_vocabulary_id: {in: userVocab.map(vocab => vocab.id)}})
      .populate('vocabulary_tag_id', {where: {user_id: inputs.userId}})

    let promises = [];

    if(inputs.english) {
      userVocab.forEach(vocab => {
        if(vocab.vocabulary_id && vocab.vocabulary_id.audio) {
          promises.push(
            AmsVocabulary.find({source_mp3: vocab.vocabulary_id.audio.split('source/').pop()}).limit(1)
              .then(data => {return data[0]})
          )
        }
      })
    }

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

      if (vocab.vocabulary_id && vocab.vocabulary_id.audio) {
        let lessonRoot;
        if (vocab.lesson) {
          lessonRoot = `https://s3contents.chinesepod.com/${vocab.lesson.type === 'extra' ? 'extra/' : ''}${vocab.lesson.id}/${vocab.lesson.hash_code}/`
        }

        try {
          audioUrlCN = vocab.vocabulary_id.audio.slice(0, 4) === 'http' ? vocab.vocabulary_id.audio : lessonRoot ? lessonRoot + vocab.vocabulary_id.audio : '';
          let params = audioUrlCN.split('source/');

          let amsObj;

          if(inputs.english) {
            amsObj = amsVocab.find(ams => ams && ams.source_mp3 === params[params.length - 1])
          }

          if(amsObj && amsObj.target_mp3) {
            audioUrlEN = params[0] + 'translation/' + amsObj.target_mp3
          }
        } catch (e) {
          sails.hooks.bugsnag.notify(`Issue with word - ${JSON.stringify(vocab)}`);
        }

        if (audioUrlCN) {
          audioUrlCN = audioUrlCN.replace('http:', 'https:')
        }
        if (audioUrlEN) {
          audioUrlEN = audioUrlEN.replace('http:', 'https:')
        }

      }
      return {
        ...vocab.vocabulary_id,
        ...{
          progress: vocab.progress,
          next_test_date: vocab.next_test_date,
          last_test_date: vocab.last_test_date,
          times_tested: vocab.times_tested,
          number_correct: vocab.number_correct,
          correct_streak: vocab.correct_streak,
          char_learned: vocab.char_learned,

          user_vocabulary_id: vocab.id,
          createdAt: vocab.createdAt,
          lesson: vocab.lesson,
          tags: tags,
          audioUrlCN: audioUrlCN,
          audioUrlEN: audioUrlEN
        }
      }
    })

    return {...deck, ...{total: userVocab.length},...{vocab: userVocab}}

  }


};
