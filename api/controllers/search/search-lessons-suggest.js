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
            fields: ['title', 'introduction', 'transcription1', 'transcription2']
          }
        },
        suggest: {
          lessonsuggest: {
            text: inputs.query,
            term: { field: 'transcription1' }
          }
        }
      }
    });

    let relevantLessons = data['body']['hits']['hits'].map(i => i['_source']['id']);

    return data['body']['hits']['hits'].map(i => i['_source']);

    // let lessons = await LessonData.find({
    //   where: {
    //     id: {
    //       in: relevantLessons
    //     }
    //   }
    // });

  }


};