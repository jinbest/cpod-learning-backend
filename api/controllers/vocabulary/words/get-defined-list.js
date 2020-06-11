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

    Promise.delay = function(t, val) {
      return new Promise(resolve => {
        setTimeout(resolve.bind(null, val), t);
      });
    };

    Promise.raceAll = function(promises, timeoutTime, timeoutVal) {
      return Promise.all(promises.map(p => {
        return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
      }));
    };

    let hskData = (require(`../../../../lib/${inputs.listId}.json`));

    let amsPromises = [];
    let cpodPromises = [];

    hskData.forEach(word => {
      if(word.hanzi) {
        cpodPromises.push(
          VocabularyNew.find({s: word.hanzi, vocabulary_class: {in: ['Key Vocabulary', 'Supplementary']}, audio: {'!=': null}, v3_id: {'!=': '0000'}}).populate('v3_id').limit(1)
            .then(data => data[0] ? data[0] : {})
        )
      }
    });

    let cpodData = [].concat(...(await Promise.raceAll(cpodPromises, 10000, {})));

    let lessonMap = cpodData.map(item => item.audio ? item.audio.split('source/').pop() : '');

    hskData.forEach(word => {
      amsPromises.push(
        AmsVocabulary.getDatastore().sendNativeQuery(`
        SELECT * FROM content_vocabulary cv
        LEFT JOIN content_detail cd ON cv.content_id = cd.content_id
        WHERE cv.source = '${word.hanzi}' AND cv.source_mp3 IN ($1) AND cv.target_mp3 IS NOT NULL AND cd.publish_time < ${new Date().getTime()/1000}
        ORDER BY cv.content_vocabulary_id DESC
        LIMIT 1
        `, [lessonMap]).then(data => data['rows'])
      )
    })

    let amsData = [].concat(...(await Promise.raceAll(amsPromises, 10000, {})));

    return {
      title: inputs.title,
      vocabulary: hskData.map(word => {
        word.s = word.hanzi;
        word.t = word.hanzi;
        word.p = word.pinyin;
        word.en = word.translations.join('; ');
        try {
          let lessonObj = cpodData.find(lesson => lesson.s === word.hanzi);
          if (lessonObj && lessonObj.v3_id) {
            word.lesson = lessonObj.v3_id;
            word.t = lessonObj.t;
            let lessonRoot = `https://s3contents.chinesepod.com/${lessonObj.v3_id.type === 'extra' ? 'extra/' : ''}${lessonObj.v3_id.id}/${lessonObj.v3_id.hash_code}/`;
            word.audioUrlCN = lessonObj.audio.slice(0, 4) === 'http' ? lessonObj.audio : lessonRoot + lessonObj.audio;
            word.audioUrlCN = word.audioUrlCN.replace('http:', 'https:')

            let amsObject = amsData.find(lesson => lessonObj.audio && lesson.source_mp3 === lessonObj.audio.split('source/').pop())

            if (amsObject && amsObject.target_mp3) {
              let params = word.audioUrlCN.split('source/');
              sails.log.info(params);
              word.audioUrlEN = params[0] + 'translation/' + amsObject.target_mp3;
            }
          }
        } catch (e) {
          sails.log.error(e);
        }

        return _.pick(word, ['s', 't', 'p', 'en', 'audioUrlCN', 'audioUrlEN']);

      })
    }
  }
};
