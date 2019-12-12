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

    let courses = await sails.hooks.elastic.client.search({
      index: 'courses',
      type: 'courses',
      body: {
        query: {
          multi_match: {
            query: inputs.query,
            fields: ['course_title^2', 'course_introduction'],
            operator: 'and',
            analyzer: 'standard',
            fuzziness: 'AUTO'
          }
        }
      }
    });

    let lessons = await sails.hooks.elastic.client.search({
      index: 'lessons',
      type: 'lessons',
      body: {
        query: {
          multi_match: {
            query: inputs.query,
            fields: ['title^3', 'introduction^2', 'transcription1', 'hosts'],
            operator: 'and',
            analyzer: 'standard',
            fuzziness: 'AUTO'
          }
        }
      }
    });

    return {
      courses: courses['body']['hits']['hits'].map(i => i['_source']),
      lessons: lessons['body']['hits']['hits'].map(i => i['_source'])
    };

  }


};
