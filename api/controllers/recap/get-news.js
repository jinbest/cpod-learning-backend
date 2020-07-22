module.exports = {


  friendlyName: 'Get news',


  description: '',


  inputs: {

  },


  exits: {

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

    return new Promise((resolve, reject) => {
      adapter.ls('news', (err, files) => {
        let returnData = [];
        sails.log.info(files);
        files = files.filter(file => file.length > 0);
        files.forEach(file => {
          if (file.length > 0) {
            returnData.push('https://chinesepod-recap.s3.amazonaws.com/news/' + file)
          }
        });
        resolve(returnData);
      });
    });
  }

};
