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
        'definition', // English
        'definitions', // English
        'traditional', // Traditional
        'simplifiedId',
        'traditionalId',
        'data',
        'timestamp'
      ],
    };

    const convert = require('pinyin-tone-converter');
    const hsk = require('@nahanil/hsk-words');

    let vocabulary = require('../../../lib/cedict_sitemaps.json');

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    const getPinyinPermutations = (simplified, traditional, pinyin) => {
      let simplifiedParts = simplified.split('');
      let traditionalParts = traditional.split('');
      let pinyinPartsDirty = pinyin.split(' ');
      let pinyinPartsClean = []; let output = [];

      pinyinPartsDirty.forEach((syllable) => {
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

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

    const calculatePriority = (simplified) => {
      let priorities = [];
      let chars = simplified.split('');
      chars.forEach(char => {
        let priority = 10000;
        try {
          let charData = sails.hooks.hanzi.getCharacterFrequency(char);
          if (charData && charData.number) {
            priority = charData.number
          }
        } catch (e) {
        }
        priorities.push(priority)
      })

      return arrAvg(priorities)
    }
    //
    // let record = vocabulary.find(vocab => vocab.simplified === inputs.word);
    //
    // if (!record) {
    //   record = vocabulary.find(vocab => vocab.traditional === inputs.word);
    // }

    let records = sails.hooks.hanzi.definitionLookup(inputs.word);

    if (!records || !records[0] || !records[0].simplified) {
      throw new Error('No Such Entry')
    }

    let data = await sails.helpers.dictionary.getDetails(records[0].simplified)

    for (let i = 0; i < records.length; i++) {

      let record = records[i]

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

      record.data = JSON.stringify(data);
      record.timestamp = new Date().toISOString();

      record.simplifiedId = record.simplified;
      record.traditionalId = record.traditional;

      if (record.definition) {
        record.definitions = record.definition.split('/')
      }

      index.elasticRecord.forEach(key => {
        indexRecord[key] = record[key];
      });

      indexRecord.word_length = indexRecord.simplified ? indexRecord.simplified.length : 0;
      indexRecord.pinyin_length = indexRecord.pinyin_tones ? indexRecord.pinyin_tones.length : 0;

      let hskLevel = await hsk.findLevel(indexRecord.simplified)
      indexRecord.hsk = hskLevel > 0 ? hskLevel : 7;

      indexRecord.priority = calculatePriority(indexRecord.simplified);

      commands.push(action);
      commands.push(indexRecord);

      // sails.log.warn(indexRecord.definitions);
      // sails.log.warn(indexRecord.definition);
      // sails.log.warn(record.definition);

      await sails.hooks.elastic.client.index({index: index.elasticIndex, id: `${record.simplified}-${record.traditional}-${record.pinyin}-${record.definition}`, body: indexRecord, refresh: true})
        .then( async () => {
          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: record.simplified})
            .catch(() => {});

          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: record.traditional})
            .catch(() => {});

          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id:  `${record.simplified}-${record.traditional}-${record.pinyin}`})
            .catch(() => {});

          let cleanupRecord = vocabulary.find(vocab => vocab.simplified === record.simplified);

          if (cleanupRecord) {
            await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: `${cleanupRecord.simplified}-${cleanupRecord.traditional}-${cleanupRecord.pinyin}`})
              .catch(() => {});
          }

        })
        .catch(error => sails.log.error(error));
    }
  }
};

