module.exports = {


  friendlyName: 'Get popular lessons for Lesson Recap',


  description: '',

  inputs: {
    days: {
      type: 'number',
      description: 'Length of period in days for which to lookup Popular Lessons'
    }
  },



  exits: {

    'noLessons': {
      description: 'Unfortunately there are no lessons'
    }

  },


  fn: async function (inputs) {
    let period = 1;
    if (inputs.days) {
      period = inputs.days <= 30 ? inputs.days : 30;
    }

    var AwsS3 = require ('aws-sdk/clients/s3');
    const s3 = new AwsS3 ({
      accessKeyId: sails.config.custom.awsKey,
      secretAccessKey: sails.config.custom.awsSecret,
      region: 'us-east-1',
    });

    const listDirectories = params => {
      return new Promise ((resolve, reject) => {
        const s3params = {
          Bucket: 'chinesepod-recap',
          MaxKeys: 1000,
          Delimiter: '/',
        };
        s3.listObjectsV2 (s3params, (err, data) => {
          if (err) {
            reject (err);
          }
          resolve (data);
        });
      });
    };

    let recapList = [];

    await listDirectories()
      .then((response) => {
        response['CommonPrefixes'].forEach((item,i) => {
          recapList[i] = item['Prefix'].split('/')[0];
        });
      });

    let relevantLogs = [];

    let baseUrls = ['https://www.chinesepod.com/api/v1/lessons/get-dialogue?lessonId=', ];

    recapList.forEach((lesson) => {
      baseUrls.forEach((url) => relevantLogs.push(url + lesson))
    });

    sails.log.info(relevantLogs);

    sails.log.info(new Date(Date.now() - period * 24 * 60 * 60 * 1000));

    let newLogs = await Logging.find({
      where: {
        accesslog_url: {
          in: relevantLogs
        },
        createdAt: {
          '>': new Date(Date.now() - period * 24 * 60 * 60 * 1000)
        }
      },
      select: ['id', 'accesslog_url']
    });

    let oldLogs = await Logging.find({
      where: {
        accesslog_urlbase: {
          'in': [
            'https://chinesepod.com/lessons/api',
            'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
            'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
          ]
        },
        createdAt: {
          '>': new Date(Date.now() - period * 24 * 60 * 60 * 1000)
        }
      },
      select: ['id', 'accesslog_url']
    });



    sails.log.info([...newLogs, ...oldLogs]);

    return [...newLogs, ...oldLogs]

    // let sql = `
    // SELECT DISTINCT log.accesslog_user, log.accesslog_url, u.ltv, u.name, u.email
    // FROM chinesepod_logging.cp_accesslog log
    // LEFT JOIN chinesepod_production.users u ON log.accesslog_user=u.email
    // LEFT JOIN chinesepod_production.user_site_links usl ON u.id=usl.user_id
    // WHERE log.accesslog_time > $1
    // AND log.accesslog_urlbase = 'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
    // AND usl.usertype_id in (5,6);
    // `; //Android specific Endpoint used in query
    //
    // let logData = await sails.sendNativeQuery(
    //   sql, [new Date(Date.now() - 60 * 60 * 1000 * (period ? period * 24 : 12) ).toISOString().split('T')[0]] //Adding 12 hour lag
    // );
    //
    // let popularLessons = [];
    //
    // let cleanLog = [];
    //
    // logData['rows'].forEach(function (log) {
    //   try {
    //     let v3id = log['accesslog_url'].split('v3_id=')[1].split('&')[0];
    //     cleanLog.push({
    //       name: log.name,
    //       email: log.email,
    //       v3id: v3id,
    //       ltv: log.ltv
    //     });
    //     popularLessons.push(v3id);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // });
    //
    // let topLessons = {};
    // popularLessons.forEach(function (lesson) {
    //   topLessons[lesson] = (topLessons[lesson] || 0) +1;
    // });
    //
    // let sortedLessons = Object.keys(topLessons).sort(function (a, b) {
    //   return topLessons[b]-topLessons[a]
    // });
    //
    // let topLessonItem = sortedLessons[0];
    //
    // if (topLessons[topLessonItem] < 2) {
    //   topLessonItem = logData['rows'].sort((a, b) => (a.ltv < b.ltv) ? 1 : -1)[0]['accesslog_url'].split('v3_id=')[1].split('&')[0]
    // }
    //
    // if (!topLessonItem) {
    //   throw 'noLessons'
    // }
    //
    // let topLesson = await Contents.findOne({
    //   where: {v3_id:topLessonItem},
    //   select: ['v3_id', 'title', 'hash_code', 'image', 'type']
    // });
    //
    // let topLessonUsers = cleanLog.filter(student => student['v3id'] === topLessonItem);
    //
    // topLessonUsers.sort((b,a) => (a.ltv > b.ltv) ? 1 : ((b.ltv > a.ltv) ? -1 : 0));
    //
    // topLesson['imageUrl'] = topLesson.type === 'lesson'
    //   ? `https://s3contents.chinesepod.com/${topLesson.v3_id}/${topLesson.hash_code}/${topLesson.image}`
    //   : `https://s3contents.chinesepod.com/extra/${topLesson.v3_id}/${topLesson.hash_code}/${topLesson.image}`;
    //
    // return {
    //   topLesson: topLesson,
    //   topLessonUsers: topLessonUsers,
    //   otherTopLessons: sortedLessons.slice(1),
    //   lessonViews: topLessons,
    //   days: period
    // }
  }


};
