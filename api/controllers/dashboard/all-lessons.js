module.exports = {


  friendlyName: 'All lessons',


  description: '',


  inputs: {
    limit: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    // let userId = 1016995;
    inputs.userId = this.req.session.userId;

    let rawData = await LessonData.find({
      where: {
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'publish'
      },
      sort: 'publication_timestamp DESC',
      limit: inputs.limit ? inputs.limit : 10
    }).populate('userContents', {
      where: {user_id: inputs.userId, lesson_type: 0}
    });

    let cleanData = [];
    rawData.forEach((lesson) => {
      if (lesson.userContents[0]){
        lesson.saved = lesson.userContents[0].saved ? lesson.userContents[0].saved : 0;
        lesson.studied = lesson.userContents[0].studied ? lesson.userContents[0].studied : 0;
        delete lesson.userContents;
        cleanData.push(lesson)
      } else {
        delete lesson.userContents;
        cleanData.push(lesson)
      }
    });
    return cleanData
  }

};
