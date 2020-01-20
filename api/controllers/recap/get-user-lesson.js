module.exports = {


  friendlyName: 'Get user lesson',


  description: 'Returns relevant User Lesson based on User ID',


  inputs: {

    sessionId: {
      type:  'string',
      description: 'Session ID provided by the PHP site API layer',
      example: '4d99a8f17364d8caedc4b64e8d5b319e973b6abc39addbba58538f594468961a4ce883',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Relevant user lesson sent successfully'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided sessionid is invalid.',
    },

    noLesson: {
      statusCode: '404',
      description: 'User Has No Available Relevant Recap Lessons',
    }

  },


  fn: async function (inputs) {

    const minTimer = 15; //minutes

    let testers = ['mg@chinesepod.com', 'ugis@chinesepod.com', 'mick@chinesepod.com'];

    let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

    if(!session) {
      throw 'invalid'
    }

    const redis = require("redis"),
      client = redis.createClient('redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/3');

    const {promisify} = require('util');
    const getAsync = promisify(client.get).bind(client);

    //TODO REMOVE THIS DUMMY API CALL PROCESS
    if (testers.includes(session.email)) {
      let currentHour = new Date(new Date() - 4 * 60 * 60 * 1000).getHours(); //NY Time
      let latestStudiedLesson = '4121';

      if([1,6,11,16,21].includes(currentHour)) {
        latestStudiedLesson = '4123'
      } else if ([2,7,12,17,22].includes(currentHour)) {
        latestStudiedLesson = '4124'
      } else if ([3,8,13,18,23].includes(currentHour)) {
        latestStudiedLesson = '4125'
      } else if ([4,9,14,19].includes(currentHour)) {
        latestStudiedLesson = '4126'
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});

      let lessonTitle = '';
      let lessonImg = '';

      if (!content) {
        sails.log.error('No Recap Lesson for Testers');
        lessonTitle = 'Demo Lesson for Testers';
        lessonImg = 'https://via.placeholder.com/640x360.png?text=Sample+Image+For+Missing+Artwork';
      } else {
        lessonTitle = content.title;
        lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      return {
        lessonTitle: lessonTitle,
        lessonId: latestStudiedLesson, //latestStudiedLesson
        lessonImg: lessonImg,
        emailAddress: session.email,
        charSet: 'simplified', //charset
        subscription: 'premium' //subscription
      }

    } else {
      let user = await User.findOne({
        email: session.email
      });

      if(!user.id) {
        throw 'invalid'
      }
      //Connect Sails Session to PHP API Session
      this.req.session.userId = user.id;

      let response = await getAsync(user.email);

      if (response) {
        let json = false;
        try {
          json = JSON.parse(response);
        } catch (e) {
          sails.log.error(e)
        }

        if (json && new Date(json['timestamp']) > new Date(Date.now() - minTimer * 60 * 60 * 1000)) {

          sails.log.info({result: new Date(json['timestamp']) > new Date(Date.now() - minTimer * 60 * 60 * 1000), killdate: new Date(Date.now() - minTimer * 60 * 60 * 1000), redisdate: new Date(json['timestamp'])});

          return JSON.parse(response)
        }
      }

      let latestLesson = await Logging.find({
        where: {
          id: user.email,
          accesslog_urlbase: {
            'in': [
              'https://chinesepod.com/lessons/api',
              'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
              'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
              'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
            ]}
        },
        select: ['accesslog_url', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      });

      let latestJSLesson = await Logging.find({
        where: {
          id: user.email,
          accesslog_urlbase: 'https://www.chinesepod.com/api/v1/lessons/get-dialogue'
        },
        select: ['accesslog_url', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      });


      // let latestLesson = (await sails.sendNativeQuery(`
      // SELECT accesslog_url, accesslog_time
      // FROM chinesepod_logging.cp_accesslog
      // WHERE accesslog_user = '${user.email}'
      // AND accesslog_urlbase in ('https://chinesepod.com/lessons/api', 'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail', 'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail', 'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue')
      // ORDER BY accesslog_time DESC
      // LIMIT 1
      // `))['rows'];
      //
      // let latestJSLesson = (await sails.sendNativeQuery(`
      // SELECT accesslog_url, accesslog_time
      // FROM chinesepod_logging.cp_accesslog
      // WHERE accesslog_user = '${user.email}'
      // AND accesslog_urlbase = 'https://www.chinesepod.com/api/v1/lessons/get-dialogue'
      // ORDER BY accesslog_time DESC
      // LIMIT 1
      // `))['rows'];

      if (!latestLesson && !latestJSLesson){
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      let latestStudiedLesson = [];

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
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      if (!latestStudiedLesson){
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      //Select User CharSet
      let userSettings = await UserSettings.findOne({user_id: user.id});

      let charSet = 'simplified';

      try {
        let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
        if (rawChar == 2) {
          charSet = 'traditional';
        }

      } catch (e) {
        await sails.helpers.users.setCharSet(user.id, charSet);
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});
      let lessonImg = '';
      if (content) {
        lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      // Logging API Requests

      // sails.hooks.jobs.loggingQueue.add('Logging Requests',
      //   {
      //     userId: user.id,
      //     ip: this.req.ip,
      //     url: `https://www.chinesepod.com${this.req.url}`,
      //     sessionId: this.req.session.id,
      //     urlbase: `https://www.chinesepod.com${this.req.path}`,
      //     referer: this.req.get('referer')
      //   },
      //   {
      //     attempts: 2,
      //     timeout: 60000
      //   }
      // );

      let access = await sails.helpers.users.getAccessType(user.id);

      let returnData = {
        lessonTitle: content ? content.title : 'ChinesePod Lesson',
        lessonId: latestStudiedLesson,
        lessonImg: lessonImg,
        emailAddress: session.email,
        charSet: charSet,
        subscription: access ? access : 'Free',
        timestamp: new Date()
      };

      client.set(user.email, JSON.stringify(returnData));

      client.end(true);

      return returnData

    }
  }
};
