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
    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

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

    let newLogs = await Logging.find({
      where: {
        id: {
          '!=': 'NONE'
        },
        accesslog_url: {
          in: relevantLogs
        },
        createdAt: {
          '>': new Date(Date.now() - period * 24 * 60 * 60 * 1000)
        }
      },
      select: ['id', 'accesslog_url']
    });

    newLogs.forEach((log) => log.lessonId = log.accesslog_url.split('lessonId=')[1]);

    let oldLogs = await Logging.find({
      where: {
        id: {
          '!=': 'NONE'
        },
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

    oldLogs.forEach((log) => log.lessonId = log.accesslog_url.split('v3_id=')[1].split('&')[0])

    let allLogs = [...newLogs, ...oldLogs];

    const groupByLessonId = groupBy('lessonId');

    let groupedLogs = groupByLessonId(allLogs);

    let returnList = [];

    Object.keys(groupedLogs).map((i) => {
      let users = [];
      groupedLogs[i].forEach((log) => users.push(log.id));
      returnList.push({
        lessonId: i,
        users: users,
        views: users.length
      })
    });

    return returnList.sort((a, b) => b.views - a.views)

  }


};
