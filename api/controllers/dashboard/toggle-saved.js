module.exports = {


  friendlyName: 'Toggle saved',


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
    // let userId = 1016995;
    inputs.userId = this.req.session.userId;

    let currentStatus = await UserContents.findOne({user_id: userId, lesson: inputs.lessonId, lesson_type: 0});
    if (currentStatus) {
      await UserContents.updateOne({id: currentStatus.id})
        .set({saved: inputs.status ? 1 : 0})
    } else {
      await UserContents.create({
        user_id: inputs.userId ,
        lesson: inputs.lessonId,
        saved: inputs.status ? 1 : 0,
        lesson_type: 0
      })
    }
  }


};
