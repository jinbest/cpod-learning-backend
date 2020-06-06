module.exports = {


  friendlyName: 'Get defined list',


  description: '',


  inputs: {
    listId: {
      type: 'string'
    }

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    const convert = require('pinyin-tone-converter');

    if(![
      'hsk-1',
      'hsk-2',
      'hsk-3',
      'hsk-4',
      'hsk-5',
      'hsk-6',
    ].includes(inputs.listId)){
      throw 'notFound'
    }

    let hskData = require(`../../../../lib/${inputs.listId}.json`);

    let promises = [];

    hskData.forEach(word => {
      promises.push(
        AmsVocabulary.getDatastore().sendNativeQuery(`
        SELECT * FROM content_vocabulary cv
        LEFT JOIN content_detail cd ON cv.content_id = cd.content_id
        WHERE cv.source = '${word.hanzi}' AND cv.source_mp3 IS NOT NULL AND cv.target_mp3 IS NOT NULL AND cd.publish_time < ${new Date().getTime()/1000}
        ORDER BY cv.content_vocabulary_id DESC
        LIMIT 1
        `).then(data => data['rows'])
      )
    })

    let vocabData = [].concat(...(await Promise.all(promises)));

    let lessonData = await LessonData.find({id: {in: vocabData.map(vocab => vocab.v3id)}}).select('type')

    vocabData = vocabData.map(vocab => {


      if (vocab.source_mp3) {

        try {

          let lessonObj = lessonData.find(lesson => lesson.id === vocab.v3id)

          let lessonRoot = `https://s3contents.chinesepod.com/${lessonObj.type === 'extra' ? 'extra/' : ''}${vocab.v3id}/${vocab.hash_code}/`

          vocab.audioUrlCN = vocab.source_mp3.slice(0, 4) === 'http' ? vocab.source_mp3 : lessonRoot + 'mp3/glossary/source/' + vocab.source_mp3;
          vocab.audioUrlEN = vocab.target_mp3.slice(0, 4) === 'http' ? vocab.target_mp3 : lessonRoot + 'mp3/glossary/translation/' + vocab.target_mp3;

        } catch (e) {
          // sails.log.error(e);
          sails.hooks.bugsnag.notify(`Issue with DEFINED LIST word - ${JSON.stringify(vocab)}`);
        }


      }
      return {s: vocab.source, p: convert.convertPinyinTones(vocab.phonetic), t: vocab.source_trad, en: vocab.target, audioUrlCN:  vocab.audioUrlCN, audioUrlEN: vocab.audioUrlEN, lesson: {}}
    })

    return vocabData

  }


};
