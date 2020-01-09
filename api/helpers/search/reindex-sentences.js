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
      elasticModel: 'SentenceIndes',
      elasticIndex: 'sentences',
      elasticRecord: [
        'id',
        'simplified', // Simplified
        'pinyin', // Pinyin
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

    await new Promise(async (resolve, reject) => {

      await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex}, (error, response) => {
        if (error) {
          sails.log.error(error);
        }
      });

      sails.log.info('Index Deleted');


      let dialogues = await ContentDialogues.find().sort('id DESC').populate('v3_id');

      let expansions = await ContentExpansions.find().sort('id DESC').populate('v3_id');

      let records = [];

      dialogues.concat(expansions).forEach((dialogue) => {
        try {


          dialogue.vocabulary = [];
          dialogue.sentence = [];
          dialogue.pinyin = [];
          dialogue.simplified = [];
          dialogue.traditional = [];
          dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(a, b, c, d, e, f, g, h) {
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
          dialogue.english = dialogue.row_2;
          dialogue.lessonId = dialogue.v3_id ? dialogue.v3_id.id : '';
          dialogue.title = dialogue.v3_id ? dialogue.v3_id.title : '';
          dialogue.level = dialogue.v3_id ? dialogue.v3_id.level : '';
          dialogue.image = !dialogue.v3_id ? '' : dialogue.v3_id.type === 'lesson'
            ? `https://s3contents.chinesepod.com/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.v3_id.image}`
            : `https://s3contents.chinesepod.com/extra/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.v3_id.image}`;
          dialogue.audio = dialogue.audio.slice(0,4) === 'http' ? dialogue.audio : !dialogue.v3_id ? '' : dialogue.v3_id.type === 'lesson'
            ? `https://s3contents.chinesepod.com/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.audio}`
            : `https://s3contents.chinesepod.com/extra/${dialogue.v3_id.id}/${dialogue.v3_id.hash_code}/${dialogue.audio}`;
          dialogue.slug = dialogue.v3_id ? dialogue.v3_id.slug : '';
          records.push(_.pick(dialogue, ['id', 'simplified', 'traditional', 'pinyin', 'english', 'audio', 'lessonId', 'title', 'image', 'slug' , 'level', 'sentence']))
        } catch (e) {
          sails.log.info(e);
        }
      });

      sails.log.info('Records Pooled');

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
          reject(error);
        } else {
          resolve(response);
        }
      });

    });
  }


};

