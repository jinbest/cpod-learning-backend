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

    const cleanLink = (link) => {
      if (!link) {
        return ''
      }
      link = link.replace('http:', 'https:');
      link = link.replace('https://s3.amazonaws.com/chinesepod.com/', 'https://s3contents.chinesepod.com/');
      return link
    }

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

    let lessonRoot = `https://s3contents.chinesepod.com/${lessonData.type === 'extra' ? 'extra/' : ''}${lessonData.id}/${lessonData.hash_code}/`

    if (access === 'premium' || access === 'admin') {
      if (lessonData.mp3_private) {
        returnData.downloads.lesson =  cleanLink(
          lessonData.mp3_private && lessonData.mp3_private.startsWith('http')
            ? lessonData.mp3_private
            : lessonRoot + lessonData.mp3_private
        );
      }
      if (lessonData.mp3_dialogue) {
        returnData.downloads.dialogue = cleanLink(
          lessonData.mp3_dialogue && lessonData.mp3_dialogue.startsWith('http')
            ? lessonData.mp3_dialogue
            : lessonRoot + lessonData.mp3_dialogue
        );
      }
      if (lessonData.mp3_thefix) {
        returnData.downloads.review = cleanLink(
          lessonData.mp3_thefix && lessonData.mp3_thefix.startsWith('http')
            ? lessonData.mp3_thefix
            : lessonRoot + lessonData.mp3_thefix
        );
      }
      if (lessonData.pdf1) {
        returnData.downloads.pdf1 = cleanLink(
          lessonData.pdf1 && lessonData.pdf1.startsWith('http')
            ? lessonData.pdf1
            : lessonRoot + lessonData.pdf1
        );
      }
      if (lessonData.pdf2) {
        returnData.downloads.pdf2 = cleanLink(
          lessonData.pdf2 && lessonData.pdf2.startsWith('http')
            ? lessonData.pdf2
            : lessonRoot + lessonData.pdf2
        );
      }
    } else if (access === 'basic') {
      if (lessonData.pdf1) {
        returnData.downloads.pdf1 = cleanLink(
          lessonData.pdf1 && lessonData.pdf1.startsWith('http')
            ? lessonData.pdf1
            : lessonRoot + lessonData.pdf1
        );
      }
      if (lessonData.pdf2) {
        returnData.downloads.pdf2 = cleanLink(
          lessonData.pdf2 && lessonData.pdf2.startsWith('http')
            ? lessonData.pdf2
            : lessonRoot + lessonData.pdf2
        );
      }
    }

    return returnData;
  }
};
