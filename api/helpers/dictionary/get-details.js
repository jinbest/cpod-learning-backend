module.exports = {


  friendlyName: 'Get details',


  description: '',


  inputs: {
    word: {
      type: 'string'
    }
  },


  fn: async function (inputs) {
    const convert = require('pinyin-tone-converter');

    // All done.
    let definitions = sails.hooks.hanzi.definitionLookup(inputs.word);

    sails.log.info(definitions);

    if (!definitions) {

      let segments = sails.hooks.hanzi.segment(inputs.word);

      if (segments && segments.length) {
        definitions =  segments.map(phrase => sails.hooks.hanzi.definitionLookup(phrase))
      }
    } else {
      if(definitions.length > 1) {
        definitions = definitions.sort((a, b) => (a.definition.split('/').length < b.definition.split('/').length) ? 1 : -1)
      }
    }

    if(!definitions) {
      throw 'invalid'
    }

    let compounds = sails.hooks.hanzi.getCharactersWithComponent(inputs.word);

    if(Array.isArray(compounds)) {
      compounds = [].concat(compounds.map(character => {
        if (character) {
          let definition = sails.hooks.hanzi.definitionLookup(character);
          return definition ? definition : false;
        }
      }));
    } else {
      compounds = [];
    }

    let lessonData = await LessonData.find({
        publication_timestamp: {
          '<': new Date()
        },
        status_published: 'publish',
        is_private: 0,
        or: [
          {transcription1: { contains: inputs.word }},
          {transcription2: { contains: inputs.word }}
        ]
      })
      .select('id')
      .sort([
        {publication_timestamp: 'DESC'},
        {channel_id: 'ASC'}
      ])
      .limit(10)

    let relevantLessons = lessonData.map(lesson => lesson.id)

    const getDialogues = async () => {
      return await ContentDialogues.find({
        row_1: {
          contains: inputs.word
        },
        v3_id: {in: relevantLessons}
      }).populate('v3_id').sort('id DESC').limit(10)
    }

    const getVocabulary = async () => {
      return (await Vocabulary.find({
        or: [
          {column_1: inputs.word},
          {column_4: inputs.word},
        ],
        vocabulary_class: {
          in: ['Key Vocabulary', 'Supplementary']
        },
        audio: {'!=': null},
        v3_id: {
          '<': 5000
        }
      }).sort('id DESC').populate('v3_id').limit(1))[0]
    }

    let rawDialogues = []; let vocabData;

    await Promise.all([
      getDialogues()
        .then(data => rawDialogues = data)
        .catch()
      ,
      getVocabulary()
        .then(data => vocabData = data)
        .catch()
    ]);

    if (vocabData && vocabData.audio) {
      if (vocabData.audio.split('http').length > 1) {
        vocabData.audioUrl = vocabData.audio;
      } else {
        if(vocabData.v3_id && vocabData.v3_id.type && vocabData.v3_id.id && vocabData.v3_id.hash_code) {
          vocabData.audioUrl = `https://s3contents.chinesepod.com/${vocabData.v3_id.type === 'extra' ? 'extra/' : ''}${vocabData.v3_id.id}/${vocabData.v3_id.hash_code}/${vocabData.audio}`;
        }
      }
    }

    let lessons = [];
    rawDialogues.forEach((dialogue) => {
      let lessonRoot = `https://s3contents.chinesepod.com/${dialogue.v3_id.type === 'extra' ? 'extra/' : ''}${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/`
      dialogue.vocabulary = [];
      dialogue.sentence = [];
      dialogue.english = dialogue.row_2;
      dialogue.pinyin = '';
      dialogue.simplified = '';
      dialogue.traditional = '';
      dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(A, B, C, D, E, F, G, H) {

        let d = ''; let e = ''; let c = ''; let b = ''; let g = '';

        try {d = decodeURI(D)} catch (err) {
          d = D;
          sails.log.error(err)
        }
        try {e = decodeURI(E)} catch (err) {
          e = E;
          sails.log.error(err)
        }
        try {c = decodeURI(C)} catch (err) {
          c = C;
          sails.log.error(err)
        }
        try {b = decodeURI(B)} catch (err) {
          b = B;
          sails.log.error(err)
        }

        dialogue.pinyin += c + ' ';
        dialogue.simplified += d;
        dialogue.traditional += e;

        if (G) {
          try {g = decodeURI(G)} catch (err) {
            g = G;
            sails.log.error(err)
          }
          dialogue.sentence.push(g);
          dialogue.pinyin += g;
          dialogue.simplified += g;
          dialogue.traditional += g;
        }
      });
      dialogue['audioUrl'] = lessonRoot + dialogue.audio
      dialogue.pinyin = convert.convertPinyinTones(dialogue.pinyin);
      dialogue.lessonInfo = _.pick(dialogue.v3_id, ['title', 'image', 'slug', 'level']);
      lessons.push(_.pick(dialogue, ['audioUrl', 'english', 'pinyin', 'traditional', 'simplified', 'lessonInfo']))
    });

    let related = [].concat(...sails.hooks.hanzi.getExamples(inputs.word));
    related = related.slice(0,20);
    let idioms = [].concat(...sails.hooks.hanzi.dictionarySearch(inputs.word)).filter(item => item.definition && item.definition.includes('idiom'));
    idioms = idioms.slice(0, 20);
    compounds = [].concat(...compounds.filter(i => !!i).slice(0,20))
    compounds.forEach(i => {
      try {
        i.pinyin = convert.convertPinyinTones(i.pinyin);
        i.definition = convert.convertPinyinTones(i.definition)
      } catch (e) {
        sails.log.info(i)
      }
    });
    definitions.forEach(i => {
      try {
        i.pinyin = convert.convertPinyinTones(i.pinyin);
        i.definition = convert.convertPinyinTones(i.definition)
      } catch (e) {
        sails.log.info(i)
      }
    });
    related.forEach(i => {
      try {
        i.pinyin = convert.convertPinyinTones(i.pinyin);
        i.definition = convert.convertPinyinTones(i.definition)
      } catch (e) {
        sails.log.info(i)
      }
    });
    idioms.forEach(i => {
      try {
        i.pinyin = convert.convertPinyinTones(i.pinyin);
        i.definition = convert.convertPinyinTones(i.definition)
      } catch (e) {
        sails.log.info(i)
      }
    });

    return {
      definition: definitions,
      audioUrl: vocabData && vocabData.audioUrl ? vocabData.audioUrl : '',
      compounds: compounds,
      decomposition: sails.hooks.hanzi.decomposeMany(inputs.word, 2),
      related: related,
      idioms: idioms,
      lessons: lessons

    }

  }


};