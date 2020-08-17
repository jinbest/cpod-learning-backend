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
        'pinyin_permutations',
        'definitions', // English
        'traditional', // Traditional
        'simplifiedId',
        'traditionalId',
        'data',
        'timestamp'
      ],
    };

    const convert = require('pinyin-tone-converter');

    let vocabulary = require('../../../lib/cedict_sitemaps.json');

    const getPinyinPermutations = (simplified, traditional, pinyin) => {
      let simplifiedParts = simplified.split('');
      let traditionalParts = traditional.split('');
      let pinyinPartsDirty = pinyin.split(' ');
      let pinyinPartsClean = []; let output = [];

      pinyinPartsDirty.forEach((syllable, index) => {
        pinyinPartsClean.push(syllable.replace(/[0-9]/g, ''))
      });

      output.push(pinyinPartsClean.join(' '));
      output.push(pinyinPartsClean.join(''));

      for (let i = 0; i < pinyinPartsDirty.length; i++) {

        let simplifiedAndClean =
          simplified.slice(0, i)
          + pinyinPartsClean[i]
          + simplified.slice(i + 1, simplified.length)
        let traditionalAndClean =
          traditional.slice(0, i)
          + pinyinPartsClean[i]
          + traditional.slice(i + 1, traditional.length)
        let simplifiedAndDirty =
          simplified.slice(0, i)
          + pinyinPartsDirty[i]
          + simplified.slice(i + 1, simplified.length)
        let traditionalAndDirty =
          traditional.slice(0, i)
          + pinyinPartsDirty[i]
          + traditional.slice(i + 1, traditional.length)

        let cleanAndSimplified =
          pinyinPartsClean.slice(0, i).join('')
          + simplified[i]
          + pinyinPartsClean.slice(i + 1, pinyinPartsClean.length).join('')
        let cleanAndTraditional =
          pinyinPartsClean.slice(0, i).join('')
          + traditional[i]
          + pinyinPartsClean.slice(i + 1, pinyinPartsClean.length).join('')
        let dirtyAndSimplified =
          pinyinPartsDirty.slice(0, i).join('')
          + simplified[i]
          + pinyinPartsDirty.slice(i + 1, pinyinPartsDirty.length).join('')
        let dirtyAndTraditional =
          pinyinPartsDirty.slice(0, i).join('')
          + traditional[i]
          + pinyinPartsDirty.slice(i + 1, pinyinPartsDirty.length).join('')

        let cleanAndDirty =
          pinyinPartsClean.slice(0, i).join('')
          + pinyinPartsDirty[i]
          + pinyinPartsClean.slice(i + 1, pinyinPartsClean.length).join('')
        let dirtyAndClean =
          pinyinPartsDirty.slice(0, i).join('')
          + pinyinPartsClean[i]
          + pinyinPartsDirty.slice(i + 1, pinyinPartsDirty.length).join('')

        if(!output.includes(simplifiedAndClean)) { output.push(simplifiedAndClean); }
        if(!output.includes(traditionalAndClean)) { output.push(traditionalAndClean); }
        if(!output.includes(simplifiedAndDirty)) { output.push(simplifiedAndDirty); }
        if(!output.includes(traditionalAndDirty)) { output.push(traditionalAndDirty); }
        if(!output.includes(cleanAndSimplified)) { output.push(cleanAndSimplified); }
        if(!output.includes(cleanAndTraditional)) { output.push(cleanAndTraditional); }
        if(!output.includes(dirtyAndSimplified)) { output.push(dirtyAndSimplified); }
        if(!output.includes(dirtyAndTraditional)) { output.push(dirtyAndTraditional); }
        if(!output.includes(cleanAndDirty)) { output.push(cleanAndDirty); }
        if(!output.includes(dirtyAndClean)) { output.push(dirtyAndClean); }
      }

      return output
    }

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

    record.pinyin_permutations = getPinyinPermutations(record.simplified, record.traditional, record.pinyin);
    record.data = JSON.stringify(await sails.helpers.dictionary.getDetails(record.simplified));
    record.timestamp = new Date().toISOString();

    record.simplifiedId = record.simplified;
    record.traditionalId = record.traditional;

    index.elasticRecord.forEach(key => {
      indexRecord[key] = record[key];
    });
    commands.push(action);
    commands.push(indexRecord);

    await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: record.simplified})
      .catch(error => sails.log.error(error));

    await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: record.traditional})
      .catch(error => sails.log.error(error));

    return await sails.hooks.elastic.client.index({index: index.elasticIndex, id: `${record.simplified}-${record.traditional}-${record.pinyin}`, body: indexRecord, refresh: true})
      .catch(error => sails.log.error(error));

  }


};

