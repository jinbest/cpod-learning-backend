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

    return await new Promise ((resolve, reject) => {
      sails.hooks.elastic.client.search({
        index: 'lessons',
        type: 'lessons',
        body: {
          query: {
            match: {
              title: inputs.query
            }
          }
        }
      }, (error, {body}) => {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })

  }


};
