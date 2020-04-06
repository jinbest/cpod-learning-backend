/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'View recap content list',


  description: 'Display "Recap content list" page.',

  inputs: {
    lessonId: {
      type: 'string'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/recap/recap-content-list'
    }

  },


  fn: async function (inputs) {
    const options =
        {
          key: 'AKIA4DQYSAHG3CJYO4XH'
          , secret: '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'
          , bucket: 'chinesepod-recap'
        }
      // This will give you an adapter instance configured with the
      // credentials and bucket defined above
      , adapter = require('skipper-better-s3')(options);

    let content = await new Promise((resolve, reject) => {
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

    return { lessonId: inputs.lessonId, content: content }
  }


};
