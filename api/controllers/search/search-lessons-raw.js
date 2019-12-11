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
        body: {
          query: {
            multi_match: {
              query: inputs.query,
              fields: ['title', 'introduction']
            }
          }
        }
      });

    return {
      data: data['body']['hits']['hits'].map(i => i['_source']),
      count: data['body']['hits']['total']['value']
    }
  }


};
