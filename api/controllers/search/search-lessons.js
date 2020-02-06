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
    },
    levelFilters: {
      type: ['ref']
    },
    statusFilters: {
      type: ['ref']
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

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

    if (inputs.statusFilters && inputs.statusFilters.length > 0) {
      inputs.full = true
    }

    if (inputs.levelFilters && inputs.levelFilters.length > 0) {
      inputs.levelFilterIds = [];

      const levelIds = {
        newbie: 1,
        elementary: 2,
        'pre intermediate': 3,
        intermediate: 4,
        'upper intermediate': 5,
        advanced: 6,
        media: 7,
        any: 0
      };

      inputs.levelFilters.forEach(filter => {

        let cleanFilter = filter.toLowerCase();

        if (levelIds[cleanFilter]) {
          inputs.levelFilterIds.push(levelIds[cleanFilter])
        }

      })
    }

    //Check for Actual Queries
    if (!inputs.query) {

      if (inputs.levelFilters && inputs.levelFilters.length > 0) {

        sails.log.info('No Query & Has Filters');

        lessons = await sails.hooks.elastic.client.search({
          index: 'lessons',
          type: 'lessons',
          size: inputs.full ? 160 : 12,
          body: {
            query: {
              bool: {
                filter: [
                  {terms: {levelId: inputs.levelFilterIds}}
                ]
              }
            },
            sort: {
              publication_timestamp: {order: 'DESC'}
            }
          }
        });

      } else {

        sails.log.info('No Query & No Filters');

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

      }

    } else {

      if (inputs.levelFilters && inputs.levelFilters.length > 0) {

        sails.log.info('Has Query & Has Filters');

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
                  {terms: {levelId: inputs.levelFilterIds}}
                ]
              }
            }
          }
        });

      } else {

        sails.log.info('Has Query & No Filters');

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

    }

    if (inputs.statusFilters && inputs.statusFilters.length > 0) {

      sails.log.info('step 1');

      let rawData = await LessonData.find({

        where: {
          id: {
            in: lessons['body']['hits']['hits'].map(i => i['_source']['id'])
          },
          publication_timestamp: {
            '<=': new Date()
          },
          status_published: 'publish'
        },
        sort: 'publication_timestamp DESC'

      }).populate('userContents', {

        where: {user_id: inputs.userId, lesson_type: 0}

      });

      let cleanData = [];

      rawData.forEach((lesson) => {

        if (lesson.userContents[0]){

          lesson.saved = lesson.userContents[0].saved ? lesson.userContents[0].saved : 0;
          lesson.studied = lesson.userContents[0].studied ? lesson.userContents[0].studied : 0;
          delete lesson.userContents;
          cleanData.push(lesson)

        } else {

          delete lesson.userContents;
          cleanData.push(lesson)

        }

      });

      sails.log.info(inputs.statusFilters);

      inputs.statusFilters.forEach(filter => {

        sails.log.info({lessonLength: cleanData.length, preFilter: filter, userId: inputs.userId, lessonData: cleanData, studied: cleanData.filter(lesson => lesson.studied === 1 )});

        switch (filter) {
          case 'studied':
            cleanData = cleanData.filter(lesson => lesson.studied === 1);
            break;
          case 'not-studied':
            cleanData = cleanData.filter(lesson => lesson.studied !== 1);
            break;
          case 'saved':
            cleanData = cleanData.filter(lesson => lesson.saved === 1);
            break;
          case 'not-saved':
            cleanData = cleanData.filter(lesson => lesson.saved !== 1);
            break;
          default:
            break;
        }

      });

      sails.log.info({lessonLength: cleanData.length});

      lessons = cleanData;

    } else {

      lessons = lessons['body']['hits']['hits'].map(i => i['_source'])

    }

    return {
      courses: courses['body']['hits']['hits'].map(i => i['_source']),
      lessons: lessons
    };

  }


};
