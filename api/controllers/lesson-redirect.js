module.exports = {


  friendlyName: 'Lesson redirect',


  description: '',


  inputs: {
    v3id: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    let lesson = await LessonData.findOne({id: inputs.v3id});

    if (lesson) {
      return this.res.redirect(`/lesson/${lesson.slug}`)
    } else {
      return this.res.redirect('/home')
    }

  }


};
