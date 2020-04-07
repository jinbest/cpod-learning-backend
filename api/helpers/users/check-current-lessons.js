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

    let users = (await Logging.getDatastore().sendNativeQuery(`
    select distinct log.accesslog_user from chinesepod_logging.cp_accesslog log where log.accesslog_time > $1 and log.accesslog_user != 'NONE'
    `, time.toISOString()))['rows'];

    sails.log.info(users);

    users.forEach(user => userInfoQueue.add('SetCurrentLesson', {email: user}, {attempts: 2, timeout: 120000}))

  }


};

