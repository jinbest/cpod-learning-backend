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
    const chineseConv = require('chinese-conv');

    const getHanziData = (word) => {
      return sails.hooks.hanzi.definitionLookup(word);
    }

    const cleanHanziData = (array) => {
      let returnArray = [];
      array.forEach(i => {
        try {
          let item = {};
          Object.keys(i).forEach(key => {
            item[key] = i[key]
          });
          item.pinyin = convert.convertPinyinTones(i.pinyin);
          item.definition = convert.convertPinyinTones(i.definition);
          returnArray.push(item)
        } catch (e) {
          sails.log.error(e)
        }
      });
      return returnArray
    }

    // All done.
    let definitionArray = getHanziData(inputs.word)

    if (!definitionArray) {

      let segments = sails.hooks.hanzi.segment(inputs.word);

      if (segments && segments.length) {
        definitionArray =  segments.map(phrase => sails.hooks.hanzi.definitionLookup(phrase))
      }
    } else {
      if(definitionArray.length > 1) {
        definitionArray = definitionArray.sort((a, b) => (a.definition.split('/').length < b.definition.split('/').length) ? 1 : -1)
      }
    }

    if(!definitionArray) {
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


    let simplifiedChar = chineseConv.sify(inputs.word);

    let lessonData = await LessonData.find({
      publication_timestamp: {
        '<': new Date()
      },
      status_published: 'publish',
      is_private: 0,
      transcription1: { contains: simplifiedChar },
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

    const getVocabulary = async (simplified, pinyin) => {

      const cleanPinyin = await sails.helpers.pinyin.convertTones(pinyin)

      let vocab = await VocabularyNew.find({
        s: simplified,
        p: { in: [pinyin, cleanPinyin]},
        vocabulary_class: {
          in: ['Key Vocabulary', 'Supplementary']
        },
        audio: {'!=': null},
        v3_id: {
          '<': 5000
        }
      }).sort('id DESC').populate('v3_id').limit(10)

      return vocab.filter(example => example && example.p === cleanPinyin)[0]
    }

    let rawDialogues = []; let vocabData;

    let promises = [];

    promises.push(
      getDialogues()
        .then(data => rawDialogues = data)
        .catch()
    )

    if (definitionArray && definitionArray[0] && definitionArray[0].simplified && definitionArray[0].pinyin) {
      promises.push(
        getVocabulary(definitionArray[0].simplified, definitionArray[0].pinyin)
          .then(data => vocabData = data)
          .catch()
      )
    }

    await Promise.all(promises);

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
        }
        try {e = decodeURI(E)} catch (err) {
          e = E;
        }
        try {c = decodeURI(C)} catch (err) {
          c = C;
        }
        try {b = decodeURI(B)} catch (err) {
          b = B;
        }

        dialogue.pinyin += c + ' ';
        dialogue.simplified += d;
        dialogue.traditional += e;

        if (G) {
          try {g = decodeURI(G)} catch (err) {
            g = G;
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
    compounds = [].concat(...compounds.filter(i => !!i).slice(0,20));
    definitionArray = cleanHanziData(definitionArray);
    compounds = cleanHanziData(compounds);
    related = cleanHanziData(related);
    idioms = cleanHanziData(idioms);

    return {
      definition: definitionArray,
      audioUrl: vocabData && vocabData.audioUrl ? vocabData.audioUrl : '',
      compounds: compounds,
      decomposition: sails.hooks.hanzi.decomposeMany(inputs.word, 2),
      related: related,
      idioms: idioms,
      lessons: lessons
    }

  }


};
