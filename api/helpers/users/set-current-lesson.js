/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Set current lesson',


  description: '',


  inputs: {

    userId: {
      type: 'number'
    },
    lessonId: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    return await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: 'currentLesson'}, {user_id: inputs.userId, option_key: 'currentLesson', option_value: inputs.lessonId})

  }


};

