module.exports = {


  friendlyName: 'List recap lessons',


  description: 'List all ChinesePod Lesson Recap Lessons',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    var AwsS3 = require ('aws-sdk/clients/s3');
    const s3 = new AwsS3 ({
      accessKeyId: sails.config.custom.awsKey,
      secretAccessKey: sails.config.custom.awsSecret,
      region: 'us-east-1',
    });

    const listDirectories = params => {
      return new Promise ((resolve, reject) => {
        const s3params = {
          Bucket: 'chinesepod-recap',
          MaxKeys: 1000,
          Delimiter: '/',
        };
        s3.listObjectsV2 (s3params, (err, data) => {
          if (err) {
            reject (err);
          }
          resolve (data);
        });
      });
    };
    let lessonList = [];
    return await listDirectories()
      .then((response) => {
        response['CommonPrefixes'].forEach((item,i) => {
          lessonList[i] = item['Prefix'].split('/')[0];
        });
        return lessonList;
      });

  }

};
