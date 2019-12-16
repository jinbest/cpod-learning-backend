module.exports = {


  friendlyName: 'Search lessons',


  description: '',


  inputs: {
    query: {
      type: 'string',
      required: true
    },
    full: {
      type: 'boolean'
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
            analyzer: 'standard'
          }
        }
      }
    });

    let lessons = await sails.hooks.elastic.client.search({
      index: 'lessons',
      type: 'lessons',
      size: inputs.full ? 160 : 12,
      body: {
        query: {
          multi_match: {
            query: inputs.query,
            fields: ['id', 'title^3', 'introduction^2', 'transcription1^2', 'hosts'],
            operator: 'and',
            analyzer: 'standard',
            fuzziness: 1
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
