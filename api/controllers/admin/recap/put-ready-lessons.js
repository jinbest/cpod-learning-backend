/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Put ready lessons',


  description: '',


  inputs: {
    lessonList: {
      type: 'string',
      required:true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    let lessonData = inputs.lessonList.split(/(?:,| |\t|;|-|\n)+/)

    await ContentsRecapReady.destroy({});

    lessonData.filter(lessonId => lessonId.length > 3);

    if(lessonData.length < 1) {
      return
    }

    return ContentsRecapReady.createEach(lessonData.map(lessonId => {return {lessonId: lessonId}})).fetch();

    // let promises = [];
    //
    // lessonData.forEach(lesson => {
    //   promises.push(ContentsRecapReady.updateOrCreate({lessonId: lesson},{lessonId: lesson}))
    // })
    //
    // return await Promise.all(promises)

  }


};
