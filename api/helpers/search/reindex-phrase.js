module.exports = {


  friendlyName: 'Reindex vocab',


  description: '',


  inputs: {

    word: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let index = {
      model: 'vocabulary',
      elasticModel: 'vocabulary',
      elasticIndex: 'vocabulary-search',
      elasticRecord: [
        'id',
        'simplified', // Simplified
        'pinyin', // Pinyin
        'pinyin_tones',
        'definitions', // English
        'traditional', // Traditional
        'data',
        'timestamp'
      ],
    };

    const convert = require('pinyin-tone-converter');

    let vocabulary = require('../../../lib/cedict_sitemaps.json');

    let record = vocabulary.find(vocab => vocab.simplified === inputs.word);

    if (!record) {
      record = vocabulary.find(vocab => vocab.traditional === inputs.word);
    }

    if (!record) {
      throw new Error('No Such Entry')
    }

    let commands = [];
    let action = {
      index: {
        _index: index.elasticIndex,
        _type: index.elasticIndex,
      }
    };

    let indexRecord = {};

    record.pinyin_tones = convert.convertPinyinTones(record.pinyin)
      .replace('n5', 'n')
      .replace('r5', 'r')
      .replace('u:1','ǖ')
      .replace('u:2','ǘ')
      .replace('u:3','ǚ')
      .replace('u:4','ǜ')
      .replace('u:5','ü');
    record.data = JSON.stringify(await sails.helpers.dictionary.getDetails(record.simplified));
    record.timestamp = new Date().toISOString();


    index.elasticRecord.forEach(key => {
      indexRecord[key] = record[key];
    });
    commands.push(action);
    commands.push(indexRecord);

    return await sails.hooks.elastic.client.index({index: index.elasticIndex, id: record['simplified'], body: indexRecord, refresh: true})
      .catch(error => sails.log.error(error));

  }


};

