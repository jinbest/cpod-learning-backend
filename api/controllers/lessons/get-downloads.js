module.exports = {


  friendlyName: 'Get downloads',


  description: '',


  inputs: {
    userId: {
      type: 'string'
    },
    lessonId: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let access = await sails.helpers.users.getAccessType(inputs.userId);
    if (access === 'premium' || access === 'admin') {
      let lessonData = await LessonData.findOne({id: inputs.lessonId});
      let returnData = {
        type: 'premium',
        downloads: {}
      };
      if (lessonData.mp3_private) {
        returnData.downloads.lesson = 'https://s3contents.chinesepod.com/' + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_private;
      }
      if (lessonData.mp3_dialogue) {
        returnData.downloads.dialogue = 'https://s3contents.chinesepod.com/' + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_dialogue;
      }
      if (lessonData.mp3_thefix) {
        returnData.downloads.review = 'https://s3contents.chinesepod.com/' + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_thefix;
      }
      if (lessonData.pdf1) {
        returnData.downloads.pdf1 = 'https://s3contents.chinesepod.com/' + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf1;
      }
      if (lessonData.pdf2) {
        returnData.downloads.pdf2 = 'https://s3contents.chinesepod.com/' + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf2;
      }
      return returnData;
    } else {
      return {
        type: 'free'
      }
    }
  }


};
