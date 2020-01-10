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

    sails.log.info(definition);

    if (!definition) {
      definition = [];
      sails.hooks.hanzi.segment(inputs.query).forEach(segment => {
        definition.push(sails.hooks.hanzi.definitionLookup(segment))
      });
      if (definition.length > 0) {
        multiDefinition = true
      }
      sails.log.info(definition);
    }

    return {
      definition: definition,
      multiDefinition: multiDefinition,
      dictionary: sails.hooks.hanzi.dictionarySearch(inputs.query),
      examples: sails.hooks.hanzi.getExamples(inputs.query),
      sentences: sentences['body']['hits']['hits'].map(i => i['_source'])
    };

  }


};
