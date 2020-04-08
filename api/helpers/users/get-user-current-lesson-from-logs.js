module.exports = {


  friendlyName: 'Get user current lesson from logs',


  description: '',


  inputs: {

    email: {
      type: 'string'
    },

    window: {
      type: 'number',
      defaultsTo: 1
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'User current lesson from logs',
    },

  },


  fn: async function (inputs) {

    let window = inputs.window;
    let email = inputs.email;

    sails.log.info(`Fetching logs for ${window} days`);

    let latestLesson = await BackupLogging.find({
      where: {
        id: email,
        accesslog_urlbase: {
          'in': [
            'https://chinesepod.com/lessons/api',
            'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
            'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
            'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
          ]},
        createdAt: {
          '>': new Date(Date.now() - window * 24 * 60 * 60 * 1000)
        }
      },
      select: ['accesslog_url', 'createdAt'],
      sort: 'createdAt DESC',
      limit: 1
    });

    let latestJSLesson = await BackupLogging.find({
      where: {
        id: email,
        accesslog_urlbase: 'https://www.chinesepod.com/api/v1/lessons/get-dialogue',
        createdAt: {
          '>': new Date(Date.now() - window * 24 * 60 * 60 * 1000)
        }
      },
      select: ['accesslog_url', 'createdAt'],
      sort: 'createdAt DESC',
      limit: 1
    });

    if (!latestLesson && !latestJSLesson){
      return false
    }

    let latestStudiedLesson = '';

    try {
      if (latestJSLesson && latestJSLesson[0] && latestJSLesson[0]['createdAt'] && latestLesson && latestLesson[0] && latestLesson[0]['createdAt']) {

        if (new Date(latestJSLesson[0]['createdAt']) > new Date(latestLesson[0]['createdAt'] + ' EST')) {

          latestStudiedLesson = latestJSLesson[0]['accesslog_url'].split('lessonId=')[1]

        } else {

          latestStudiedLesson = latestLesson[0]['accesslog_url'].split('v3_id=')[1].split('&')[0];

        }

      } else if (latestJSLesson && latestJSLesson[0] && latestJSLesson[0]['accesslog_url']) {

        latestStudiedLesson = latestJSLesson[0]['accesslog_url'].split('lessonId=')[1]

      } else if (latestLesson && latestLesson[0] && latestLesson[0]['accesslog_url']) {

        latestStudiedLesson = latestLesson[0]['accesslog_url'].split('v3_id=')[1].split('&')[0]; // Switching to latest Log

      }

    } catch (e) {
      sails.log.error(e);
      return false
    }

    return latestStudiedLesson

  }



};

