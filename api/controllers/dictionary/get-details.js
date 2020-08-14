module.exports = {


  friendlyName: 'Get details',


  description: '',


  inputs: {
    word: {
      type: 'string',
      required: true
    }
  },


  exits: {
    'invalid': {
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    try {

      let storedData = await sails.hooks.elastic.client.search({
        index: 'vocabulary-search',
        // type: 'vocabulary-search',
        body: {
          query: {
            ids:{
              values: [inputs.word]
            }
          }
        }
      });

      try {
        let date = new Date()
        seoIndexQueue.add('IndexPhrase',inputs, {
          jobId: inputs.word + `-${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`
        })
      } catch (e) {
        sails.log.info(e)
      }

      if (storedData && storedData.body && storedData.body.hits.total.value) {
        return JSON.parse(storedData.body.hits.hits[0]['_source'].data);
      }

    } catch (e) {
      sails.hooks.bugsnag.notify(e);
    }

    return await sails.helpers.dictionary.getDetails.with(inputs);
  }


};
