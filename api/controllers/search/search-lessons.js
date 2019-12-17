module.exports = {


  friendlyName: 'Search lessons',


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

    let lessons = [];

    if (!inputs.query && inputs.filters && inputs.filters.length > 0) {
      lessons = await sails.hooks.elastic.client.search({
        index: 'lessons',
        type: 'lessons',
        size: inputs.full ? 160 : 12,
        body: {
          query: {
            bool: {
              filter: [
                {terms: {level: inputs.filters}}
              ]
            }
          },
          sort: {
            publication_timestamp: {order: 'DESC'}
          }
        }
      });

    } else if (!inputs.query) {

      lessons = await sails.hooks.elastic.client.search({
        index: 'lessons',
        type: 'lessons',
        size: inputs.full ? 160 : 12,
        body: {
          sort: {
            publication_timestamp: {order: 'DESC'}
          }
        }
      });

    } else if (inputs.filters && inputs.filters.length > 0) {

      lessons = await sails.hooks.elastic.client.search({
        index: 'lessons',
        type: 'lessons',
        size: inputs.full ? 160 : 12,
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
              filter: [
                {terms: {level: inputs.filters}}
              ]
            }
          }
        }
      });

    } else {

      lessons = await sails.hooks.elastic.client.search({
        index: 'lessons',
        type: 'lessons',
        size: inputs.full ? 160 : 12,
        body: {
          query: {
            multi_match: {
              query: inputs.query,
              fields: ['id', 'title^4', 'introduction^2', 'transcription1^2', 'hosts'],
              operator: 'and',
              analyzer: 'standard',
              fuzziness: 1
            },
          }
        }
      });

    }

    return {
      courses: courses['body']['hits']['hits'].map(i => i['_source']),
      lessons: lessons['body']['hits']['hits'].map(i => i['_source'])
    };

  }


};
