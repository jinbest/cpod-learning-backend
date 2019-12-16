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
          multi_match: {
            query: inputs.query,
            fields: ['title^3', 'introduction^2', 'transcription1', 'hosts'],
            operator: 'and',
            analyzer: 'standard',
            fuzziness: '3'
          }
        }
      }
    });

    return data['body']
  }


};
