module.exports = {


  friendlyName: 'List all',


  description: '',


  inputs: {

    lessonId: {
      type: 'string'
    }

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    }

  },


  fn: async function (inputs) {
    const options =
        {
          key: sails.config.custom.awsKey
          , secret: sails.config.custom.awsSecret
          , bucket: 'chinesepod-recap'
        }
      // This will give you an adapter instance configured with the
      // credentials and bucket defined above
      , adapter = require('skipper-better-s3')(options);

    let validLesson = await LessonData.count({id: inputs.lessonId});

    if (!validLesson) {
      return this.res.regularNotFound()
    }

    return new Promise((resolve, reject) => {
      adapter.ls(inputs.lessonId, (err, files) => {
        let returnData = [];
        files = files.filter(file => file.length > 0);
        files.forEach(file => {
          if (file.length > 0) {
            returnData.push('https://chinesepod-recap.s3.amazonaws.com/' + inputs.lessonId + '/' + file)
          }
        });
        resolve(returnData);
      });
    });
  }
};
