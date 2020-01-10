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
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    let sentences = await sails.hooks.elastic.client.search({
      index: 'sentences',
      type: 'sentences',
      size: inputs.full ? 160 : 10,
      body: {
        query: {
          multi_match: {
            query: inputs.query,
            fields: ['simplified', 'traditional', 'pinyin', 'english', 'pinyin_tones'],
            operator: 'and',
            analyzer: 'standard'
          }
        }
      }
    });

    let definition = sails.hooks.hanzi.definitionLookup(inputs.query);
    let multiDefinition = false;
    let segments = false;

    if (!definition) {
      definition = [];
      sails.hooks.hanzi.segment(inputs.query).forEach(segment => {
        definition.push(sails.hooks.hanzi.definitionLookup(segment))
      });
      segments = sails.hooks.hanzi.segment(inputs.query);
      if (definition.length > 0) {
        multiDefinition = true
      }
    }


    return {
      definition: definition,
      segments: segments,
      multiDefinition: multiDefinition,
      dictionary: sails.hooks.hanzi.dictionarySearch(inputs.query),
      dictionaryOnly: sails.hooks.hanzi.dictionarySearch(inputs.query, 'only'),
      examples: sails.hooks.hanzi.getExamples(inputs.query),
      sentences: sentences['body']['hits']['hits'].map(i => i['_source'])
    };

  }


};
