module.exports = {


  friendlyName: 'Upload',


  description: 'Upload recap.',

  files: ['file'],

  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    file: {
      description: 'Upstream for an incoming file upload.',
      type: 'ref'
    }

  },


  exits: {

    success: {
      outputDescription: 'The newly uploaded Files',
      outputExample: {}
    },

    noFileAttached: {
      description: 'No file was attached.',
      responseType: 'badRequest'
    },

    tooBig: {
      description: 'The file is too big.',
      responseType: 'badRequest'
    },
  },


  fn: async function ({lessonId, file}) {

    sails.log.info({lessonId, file});

    lessonId = 9999;

    var util = require('util');

    let options =
      {
        adapter: require('skipper-s3')
        , key: 'AKIA4DQYSAHG3CJYO4XH'
        , secret: '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'
        , bucket: 'chinesepod-recap'
        , region: 'us-east-1'
        , dirname: lessonId
        , ACL: 'public-read',
        headers: {
          'x-amz-acl': 'public-read'
        },
        saveAs: function (__newFileStream, next) {
          sails.log.info(__newFileStream.filename);
          return next(undefined, __newFileStream.filename);
        }
      };

    let uploadedFiles = await sails.upload(file, options)
      .intercept('E_EXCEEDS_UPLOAD_LIMIT', 'tooBig')
      .intercept((err)=>new Error('The photo upload failed: '+util.inspect(err)));

    sails.log.info(uploadedFiles);

    if(!uploadedFiles) {
      throw 'noFileAttached';
    }

    return uploadedFiles
  }


};
