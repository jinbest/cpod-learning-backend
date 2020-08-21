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

    const getPinyinPermutations = (simplified, traditional, pinyin, pinyin_tones) => {
      let simplifiedParts = simplified.split('');
      let traditionalParts = traditional.split('');
      let pinyinPartsDirty = pinyin.split(' ');
      let pinyinPartsTones = pinyin_tones.split(' ');
      let pinyinPartsClean = []; let output = [];

      pinyinPartsDirty.forEach((syllable) => {
        pinyinPartsClean.push(syllable.replace(/[0-9]/g, ''))
      });

      output.push(pinyinPartsClean.join(' '));
      output.push(pinyinPartsClean.join(''));
      // output.push(pinyinPartsDirty.join(' '));
      output.push(pinyinPartsDirty.join(''));
      output.push(pinyinPartsTones.join(''));

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

      return [...new Set(output)] // output //
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
            priority = parseInt(charData.number)
          }
        } catch (e) {
        }
        priorities.push(priority)
      })

      return arrAvg(priorities)
    }

    let records = sails.hooks.hanzi.definitionLookup(inputs.word);

    if (!records || !records[0] || !records[0].simplified) {
      throw new Error('No Such Entry')
    }

    for (let i = 0; i < records.length; i++) {

      let indexRecord = {}

      Object.keys(records[i]).forEach(key => {
        indexRecord[key] = records[i][key]
      })

      sails.log.info({
        indexRecord: indexRecord,
        record: records[i]
      })

      let commands = [];
      let action = {
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex,
        }
      };

      if (indexRecord.definition) {
        indexRecord.definitions = indexRecord.definition.split('/')
      }

      indexRecord.pinyin_tones = convert.convertPinyinTones(indexRecord.pinyin)
        .replace('n5', 'n')
        .replace('r5', 'r')
        .replace('u:1','ǖ')
        .replace('u:2','ǘ')
        .replace('u:3','ǚ')
        .replace('u:4','ǜ')
        .replace('u:5','ü');


      indexRecord.pinyin_permutations = getPinyinPermutations(indexRecord.simplified, indexRecord.traditional, indexRecord.pinyin, indexRecord.pinyin_tones);

      indexRecord.timestamp = new Date().toISOString();

      indexRecord.simplifiedId = indexRecord.simplified;
      indexRecord.traditionalId = indexRecord.traditional;

      indexRecord.word_length = indexRecord.simplified ? indexRecord.simplified.length : 0;
      indexRecord.pinyin_length = indexRecord.pinyin_tones ? indexRecord.pinyin_tones.length : 0;

      let hskLevel = await hsk.findLevel(indexRecord.simplified)
      indexRecord.hsk = hskLevel > 0 ? hskLevel : 7;

      indexRecord.priority = calculatePriority(indexRecord.simplified);

      let cpodData = await sails.helpers.dictionary.getDetails(indexRecord.simplified);

      indexRecord.data = JSON.stringify(cpodData)

      commands.push(action);
      commands.push(indexRecord);

      await sails.hooks.elastic.client.index({index: index.elasticIndex, id: `${indexRecord.simplified}-${indexRecord.traditional}-${indexRecord.pinyin_tones}-${indexRecord.definition}`, body: indexRecord, refresh: true})
        .then( async () => {
          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: indexRecord.simplified})
            .catch(() => {});

          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: indexRecord.traditional})
            .catch(() => {});

          await sails.hooks.elastic.client.delete({index: index.elasticIndex, id:  `${indexRecord.simplified}-${indexRecord.traditional}-${indexRecord.pinyin}`})
            .catch(() => {});

          let cleanupRecord = vocabulary.find(vocab => vocab.simplified === indexRecord.simplified);

          if (cleanupRecord) {
            await sails.hooks.elastic.client.delete({index: index.elasticIndex, id: `${cleanupRecord.simplified}-${cleanupRecord.traditional}-${cleanupRecord.pinyin}`})
              .catch(() => {});
          }

        })
        .catch(error => sails.log.error(error));
    }
  }
};

