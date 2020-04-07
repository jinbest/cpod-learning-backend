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

    let time = new Date(Date.now() - 6 * 60 * 60 * 1000);

    let users = await BackupLogging.find({
      createdAt: {
        '>': time
      },
      id: {
        '!=': 'NONE'
      }
    })
      .select(['id']);

    users = [...new Set(users.map(user => user.id))];

    users.forEach(user => userInfoQueue.add('SetCurrentLesson', {email: user}, {attempts: 2, timeout: 240000}))

  }


};

