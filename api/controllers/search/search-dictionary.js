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

    const convert = require('pinyin-tone-converter');

    const containsChinese = require('contains-chinese');
    let fuzziness = 0; // containsChinese(inputs.query) ? 0 : 1;

    sails.log.warn(inputs);

    let fields = containsChinese(inputs.query)
      ? ['simplified', 'traditional', 'pinyin_permutations']
      : ['pinyin', 'definitions', 'pinyin_tones', 'pinyin_permutations']

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
          "_source": ['simplified', 'traditional', 'definition', 'definitions', 'pinyin', 'hsk'],
          sort: [
            // {"timestamp": {"order": 'desc'}},
            {hsk: {order: 'ASC'}},
            {priority: {order: 'asc'}},
            '_score',
            // {word_length: {order: 'asc'}},
            // {pinyin_length: {order: 'asc'}},
          ],
          query: {
            multi_match: {
              query: inputs.query,
              fields: fields,
              operator: 'and',
              analyzer: 'standard',
              fuzziness: fuzziness
            },
          }
        }
      });
      // return vocabulary
    } else {

      const randomWords = require('../../../lib/randomChineseCharacters.json');

      vocabulary = await sails.hooks.elastic.client.search({
        index: 'vocabulary-search',
        from: inputs.skip ? inputs.skip : 0,
        size: inputs.limit ? inputs.limit : 20,
        body: {
          "_source": ['simplified', 'traditional', 'definition', 'definitions', 'pinyin', 'hsk'],
          query: {
            multi_match: {
              query: randomWords[Math.floor(Math.random() * randomWords.length)],
              fields: fields,
              operator: 'or',
              analyzer: 'standard',
              fuzziness: 0
            },
          },
        }
      });
    }

    let results = vocabulary['body']['hits']['hits'].map(i => i['_source'])
    if(results) {
      results.forEach(result => {
        if(result) {

          result.pinyin = convert.convertPinyinTones(result.pinyin)

          if(!result.definition && result.definitions) {
            if( Array.isArray(result.definitions)) {
              result.definition = result.definitions.join('/')
            } else {
              result.definition = result.definitions
            }
          }
        }
      })
    }
    // results = [].concat(...results);

    return {
      count: vocabulary['body']['hits']['total']['value'],
      results: results
    };

  }


};
