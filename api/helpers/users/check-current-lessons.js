/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Check current lessons',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let ESTtime = new Date(Date.now() - 6 * 60 * 60 * 1000);
    let UTCtime = new Date(Date.now() - 60 * 60 * 1000);

    let OldUsers = await BackupLogging.find({
      createdAt: {
        '>': ESTtime
      },
      id: {
        '!=': 'NONE'
      },
      accesslog_urlbase: {
        'in': [
          'https://chinesepod.com/lessons/api',
          'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
          'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
          'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
        ]},
    })
      .select(['id']);

    let NewUsers = await BackupLogging.find({
      createdAt: {
        '>': UTCtime
      },
      id: {
        '!=': 'NONE'
      },
      accesslog_urlbase: 'https://www.chinesepod.com/api/v1/lessons/get-dialogue'
    })
      .select(['id']);

    let users = OldUsers.concat(NewUsers);

    users = [...new Set(users.map(user => user.id))];

    users.forEach(user => userInfoQueue.add('SetCurrentLesson', {email: user}, {jobId: `SetCurrentLesson-${user}`,attempts: 2, timeout: 600000,  removeOnComplete: true}))

  }


};

