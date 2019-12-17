module.exports = {


  friendlyName: 'Search lessons',


  description: '',


  inputs: {
    query: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    let data = await sails.hooks.elastic.client.search({
      index: 'lessons',
      type: 'lessons',
      size: '1000',
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query: inputs.query,
                fields: ['title^4', 'introduction^2', 'transcription1^2', 'hosts'],
                operator: 'and',
                analyzer: 'standard',
                fuzziness: 1,
              }
            },
            // filter: [
            //   // {term: {level: 'newbie'}},
            //   {terms: {level: ['newbie', 'elementary', 'intermediate']}}
            // ]
          }
        }
      }
    });

    return data['body']
  }


};
