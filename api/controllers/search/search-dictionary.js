module.exports = {


  friendlyName: 'Search dictionary',


  description: '',


  inputs: {
    query: {
      type: 'string'
    },
    full: {
      type: 'boolean'
    },
    filters: {
      type: ['ref']
    },
    limit: {
      type: 'number',
      isInteger: true
    },
    skip: {
      type: 'number',
      isInteger: true
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    const containsChinese = require('contains-chinese');
    let fuzziness = containsChinese(inputs.query) ? 0 : 1;

    sails.log.warn(inputs);

    let fields = containsChinese(inputs.query)
      ? ['simplified', 'traditional', 'pinyin', 'pinyin_tones', 'pinyin_permutations']
      : ['simplified', 'traditional', 'pinyin', 'definitions', 'pinyin_tones', 'pinyin_permutations']

    let vocabulary;
    if(inputs.query) {

      if (inputs.query.length < 5) {
        fuzziness = 0
      }

      vocabulary = await sails.hooks.elastic.client.search({
        index: 'vocabulary-search',
        from: inputs.skip ? inputs.skip : 0,
        size: inputs.limit ? inputs.limit : 20,
        body: {
          query: {
            multi_match: {
              query: inputs.query,
              fields: fields,
              operator: 'or',
              analyzer: 'standard',
              fuzziness: fuzziness
            },
          }
        }
      });
    } else {

      const randomWords = require('../../../lib/randomChineseCharacters.json');

      vocabulary = await sails.hooks.elastic.client.search({
        index: 'vocabulary-search',
        from: inputs.skip ? inputs.skip : 0,
        size: inputs.limit ? inputs.limit : 20,
        body: {
          query: {
            multi_match: {
              query: randomWords[Math.floor(Math.random() * randomWords.length)],
              fields: fields,
              operator: 'or',
              analyzer: 'standard',
              fuzziness: 1
            },
          },
        }
      });
    }

    let results = vocabulary['body']['hits']['hits'].map(i => JSON.parse(i['_source'].data).definition)
    results = [].concat(...results);

    return {
      count: vocabulary['body']['hits']['total']['value'],
      results: results
    };

  }


};
