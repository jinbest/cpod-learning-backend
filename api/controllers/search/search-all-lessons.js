/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Search lessons',


  description: '',


  inputs: {
    query: {
      type: 'string'
    },
    limit: {
      type: 'number',
      isInteger: true
    },
    skip: {
      type: 'number',
      isInteger: true
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

    let lessonData;

    let lessonCount;

    let searchFilters = [];

    let studied = undefined;

    let saved = undefined;

    let userLessons = [];

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

      });

      searchFilters.push({terms: {levelId: inputs.levelFilterIds}})

    }

    if (inputs.statusFilters && inputs.statusFilters.length > 0) {

      inputs.statusFilters.forEach(filter => {

        sails.log.info('status Filter branch');

        switch (filter) {
          case 'studied':
            studied = 1;
            break;
          case 'not-studied':
            studied = 0;
            break;
          case 'saved':
            saved = 1;
            break;
          case 'not-saved':
            saved = 0;
            break;
          default:
            break;
        }

      });

      if (studied && saved) {

        userLessons = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: 1,
            saved: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

      } else if (studied && typeof saved === "undefined") {

        userLessons = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

      } else if (!studied && typeof saved === "undefined") {

        let cleanList = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

        userLessons = await LessonData.find({
          where: {
            id: {
              nin: cleanList.map(lesson => lesson.lesson)
            },
            publication_timestamp: {
              '<=': new Date()
            },
            status_published: 'publish'
          },
          select: ['id']
        });

        userLessons = userLessons.map(lesson => {return {lesson: lesson.id, saved: lesson.saved, studied: lesson.studied}});

      } else if (studied && !saved) {

        userLessons = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: 1,
            saved: {
              '!=': 1
            },
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

      } else if (saved && typeof studied === "undefined") {

        userLessons = await UserContents.find({
          where: {
            user_id: inputs.userId,
            saved: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

      } else if (!saved && typeof studied === "undefined") {

        let cleanList = await UserContents.find({
          where: {
            user_id: inputs.userId,
            saved: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

        sails.log.info(cleanList);

        userLessons = await LessonData.find({
          where: {
            id: {
              nin: cleanList.map(lesson => lesson.lesson)
            },
            publication_timestamp: {
              '<=': new Date()
            },
            status_published: 'publish'
          },
          select: ['id']
        });

        userLessons = userLessons.map(lesson => {return {lesson: lesson.id, saved: lesson.saved, studied: lesson.studied}});

        sails.log.info(userLessons);

      } else if (saved && !studied) {

        userLessons = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: {
              '!=': 1
            },
            saved: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

      } else if (!saved && !studied) {

        let cleanList = await UserContents.find({
          where: {
            user_id: inputs.userId,
            studied: 1,
            lesson_type: 0
          },
          select: ['lesson', 'saved', 'studied']
        });

        cleanList.concat((
          await UserContents.find({
            where: {
              user_id: inputs.userId,
              saved: 1,
              lesson_type: 0
            },
            select: ['lesson', 'saved', 'studied']
          })));

        userLessons = await LessonData.find({
          where: {
            id: {
              nin: cleanList.map(lesson => lesson.lesson)
            },
            publication_timestamp: {
              '<=': new Date()
            },
            status_published: 'publish'
          },
          select: ['id']
        });

        userLessons = userLessons.map(lesson => {return {lesson: lesson.id, saved: lesson.saved, studied: lesson.studied}});

      }

      searchFilters.push({terms: {id: userLessons.map(lesson => lesson.lesson)}});

      sails.log.info(searchFilters)

    }

    //Check for Actual Queries
    if (!inputs.query) {

      if (searchFilters.length > 0) {

        sails.log.info('No Query & Has Filters');

        sails.log.info(searchFilters);

        lessons = await sails.hooks.elastic.client.search({
          index: 'lessons',
          type: 'lessons',
          from: inputs.skip ? inputs.skip : 0,
          size: inputs.limit ? inputs.limit : 16,
          body: {
            query: {
              bool: {
                filter: searchFilters
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
          from: inputs.skip ? inputs.skip : 0,
          size: inputs.limit ? inputs.limit : 16,
          body: {
            sort: {
              publication_timestamp: {order: 'DESC'}
            }
          }
        });

      }

    } else {

      const containsChinese = require('contains-chinese');
      let fuzziness = containsChinese(inputs.query) ? 0 : 1;

      sails.log.info(fuzziness)

      if (searchFilters.length > 0) {

        sails.log.info('Has Query & Has Filters');

        lessons = await sails.hooks.elastic.client.search({
          index: 'lessons',
          type: 'lessons',
          from: inputs.skip ? inputs.skip : 0,
          size: inputs.limit ? inputs.limit : 16,
          body: {
            query: {
              bool: {
                must: {
                  multi_match: {
                    query: inputs.query,
                    fields: ['title^4', 'introduction^2', 'transcription1^2', 'hosts'],
                    operator: 'and',
                    analyzer: 'standard',
                    fuzziness: fuzziness,
                  }
                },
                filter: searchFilters
              }
            }
          }
        });

      } else {

        sails.log.info('Has Query & No Filters');

        lessons = await sails.hooks.elastic.client.search({
          index: 'lessons',
          type: 'lessons',
          from: inputs.skip ? inputs.skip : 0,
          size: inputs.limit ? inputs.limit : 16,
          body: {
            query: {
              multi_match: {
                query: inputs.query,
                fields: ['id', 'title^4', 'introduction^2', 'transcription1^2', 'hosts'],
                operator: 'and',
                analyzer: 'standard',
                fuzziness: fuzziness
              },
            }
          }
        });

      }

    }

    lessonCount = lessons['body']['hits']['total']['value'];

    lessonData = lessons['body']['hits']['hits'].map(i => i['_source']);


    //Add Studied / Saved Statuses
    let rawLessons = await UserContents.find({
      where: {
        user_id: inputs.userId,
        lesson_type: 0,
        lesson: {
          in: lessonData.map(lesson => lesson.id)
        }
      },
      select: ['lesson', 'saved', 'studied']
    });

    lessonData.forEach(lesson => {
      let history = rawLessons.filter(item => item.lesson === lesson.id)[0];
      if (history) {
        lesson.saved = history['saved'] ? history['saved'] : 0;
        lesson.studied = history['studied'] ? history['studied'] : 0;
      }

    });


    return {
      courses: courses['body']['hits']['hits'].map(i => i['_source']),
      count: lessonCount,
      lessons: lessonData
    };

  }


};
