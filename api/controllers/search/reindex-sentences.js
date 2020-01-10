module.exports = {


  friendlyName: 'Reindex vocab',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let index = {
      model: 'ContentDialogues',
      models: ['contentdialogues', 'contentexpansions'],
      elasticModel: 'SentenceIndex',
      elasticIndex: 'sentences',
      elasticRecord: [
        'id',
        'simplified', // Simplified
        'pinyin', // Pinyin
        'pinyin_tones',
        'english', // English
        'traditional', // Traditional
        'audio',
        'lessonId',
        'slug',
        'level',
        'title',
        'image'
      ],
      idColumn: 'id'
    };

    let errors = [];

    const convert = require('pinyin-tone-converter');

    await new Promise(async (resolve, reject) => {

      await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex}, (error, response) => {
        if (error) {
          // sails.log.error(error);
        }
      });

      sails.log.info('Index Deleted');

      let rawLessons = await LessonData.find({
        where: {
          publication_timestamp: {
            '<=': new Date()
          },
          status_published: 'publish'
        },
        select: ['id']
      });

      let publishedLessons = rawLessons.map(lesson => lesson.id);

      for (let m = 0; m < index.models.length; m++) {

        let currentModel = index.models[m];

        sails.log.info(`Fetching Model: ${currentModel}`);

        let total = await sails.models[currentModel].count({
          where: {
            v3_id: {
              in: publishedLessons
            }
          }
        });

        let bulkCount = Math.ceil(total / 200);

        sails.log.info(`Records Fetched in ${bulkCount} Batches`);

        for (let i = 0; i < bulkCount; i++) {

          let records = [];

          let sentences = await sails.models[currentModel].find({
            where: {
              v3_id: {
                in: publishedLessons
              }
            }
          }).sort('id DESC').skip(i * 200).limit(200).populate('v3_id');

          sentences.forEach((dialogue) => {
            try {
              dialogue.vocabulary = [];
              dialogue.sentence = [];
              dialogue.pinyin = [];
              dialogue.simplified = [];
              dialogue.traditional = [];
              dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function (a, b, c, d, e, f, g, h) {
                dialogue.sentence.push({
                  s: decodeURI(d),
                  t: decodeURI(e),
                  p: decodeURI(c),
                  en: decodeURI(b)
                });
                if (g) {
                  dialogue.sentence.push(decodeURI(g))
                }
                dialogue.vocabulary.push({
                  s: d,
                  t: e,
                  p: c,
                  en: b
                })
              });
              dialogue.simplified = (dialogue.sentence.map(item => item.s ? item.s : item)).join('');
              dialogue.traditional = dialogue.sentence.map(item => item.t ? item.t : item).join('');
              dialogue.pinyin = dialogue.sentence.map(item => item.p ? item.p : item).join(' ');
              dialogue.pinyin_tones = convert.convertPinyinTones(dialogue.pinyin);
              dialogue.english = dialogue.row_2;
              dialogue.lessonId = dialogue.v3_id ? dialogue.v3_id.id : '';
              dialogue.title = dialogue.v3_id ? dialogue.v3_id.title : '';
              dialogue.level = dialogue.v3_id ? dialogue.v3_id.level : '';
              dialogue.image = !dialogue.v3_id ? '' : dialogue.v3_id.type === 'lesson'
                ? `https://s3contents.chinesepod.com/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.v3_id.image}`
                : `https://s3contents.chinesepod.com/extra/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.v3_id.image}`;
              dialogue.audio = dialogue.audio.slice(0, 4) === 'http' ? dialogue.audio : !dialogue.v3_id ? '' : dialogue.v3_id.type === 'lesson'
                ? `https://s3contents.chinesepod.com/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.audio}`
                : `https://s3contents.chinesepod.com/extra/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.audio}`;
              dialogue.slug = dialogue.v3_id ? dialogue.v3_id.slug : '';
              records.push(_.pick(dialogue, ['id', 'simplified', 'traditional', 'pinyin', 'pinyin_tones','english', 'audio', 'lessonId', 'title', 'image', 'slug', 'level', 'sentence']))
            } catch (e) {
              sails.log.info(e);
            }
          });

          sails.log.info(`Records Pooled Batch: ${i + 1}`);

          let commands = [];
          let action = {
            index: {
              _index: index.elasticIndex,
              _type: index.elasticIndex
            }
          };

          records.forEach(record => {
            let indexRecord = {};
            index.elasticRecord.forEach(key => {
              indexRecord[key] = record[key];
            });

            commands.push(action);
            commands.push(indexRecord);
          });

          sails.log.info('Records Prepared');

          // run bulk command
          await sails.hooks.elastic.client.bulk({refresh: 'true', body: commands}, (error, response) => {
            if (error) {
              sails.log.error(error);
              errors.push(error)
              // reject(error);
            } else {
              sails.log.info(`Records Processed Batch: ${i + 1}`);
            }
          });
        }

      }

      if (!errors) {
        resolve()
      } else {
        reject(errors)
      }

    });
  }


};

