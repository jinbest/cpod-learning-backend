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
    let lessonData = inputs.lessonList.split(/(?:,| |\t|;|-)+/)

    lessonData.filter(lessonId => lessonId.length > 3);

    return await ContentsRecapReady.destroy({lessonId: {in: lessonData}});

  }


};
