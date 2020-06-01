module.exports = {


  friendlyName: 'Toggle studied',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true
    },
    lessonId: {
      type: 'string',
      required: true
    },
    status: {
      type: 'boolean',
      required: true
    }

  },


  exits: {

  },

  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (inputs.status) {
      let studiedLessonCount = await UserContents.count({
        user_id: inputs.userId,
        studied: 1,
        lesson_type: 0
      });
      if(studiedLessonCount === 0) {
        await sails.helpers.users.notifyAfterFirstLessonStudied(inputs.userId, inputs.lessonId);
      }

      await UserOptions.updateOrCreate(
        {user_id: inputs.userId, option_key: 'lastStudiedLesson'},
        {user_id: inputs.userId, option_key: 'lastStudiedLesson', option_value: inputs.lessonId}
      )
    }

    return await UserContents.updateOrCreate(
      {user_id: inputs.userId, lesson: inputs.lessonId, lesson_type: 0},
      {user_id: inputs.userId, lesson: inputs.lessonId, studied: inputs.status ? 1 : 0, lesson_type: 0}
    )
  }
};
