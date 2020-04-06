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

    if (this.req.me && this.req.me.email && this.req.me.email.split('@')[1] === 'chinesepod.com') {
      access = 'premium'
    }

    let lessonData = await LessonData.findOne({id: inputs.lessonId});

    let extra = lessonData.type === 'extra';

    let returnData = {
      type: access,
      downloads: {}
    };

    if (access === 'premium' || access === 'admin') {
      if (lessonData.mp3_private) {
        returnData.downloads.lesson = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_private;
      }
      if (lessonData.mp3_dialogue) {
        returnData.downloads.dialogue = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_dialogue;
      }
      if (lessonData.mp3_thefix) {
        returnData.downloads.review = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.mp3_thefix;
      }
      if (lessonData.pdf1) {
        returnData.downloads.pdf1 = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf1;
      }
      if (lessonData.pdf2) {
        returnData.downloads.pdf2 = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf2;
      }
    } else if (access === 'basic') {
      if (lessonData.pdf1) {
        returnData.downloads.pdf1 = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf1;
      }
      if (lessonData.pdf2) {
        returnData.downloads.pdf2 = '/' + (extra ? 'extra/' : '') + lessonData.id + '/' + lessonData.hash_code + '/' + lessonData.pdf2;
      }
    }

    return returnData;
  }
};
