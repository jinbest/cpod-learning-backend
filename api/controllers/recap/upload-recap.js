module.exports = {


  friendlyName: 'Upload',


  description: 'Upload recap.',

  files: ['photo'],

  inputs: {
    label: {
      type: 'string'
    },
    photo: {
      description: 'Upstream for an incoming file upload.',
      type: 'ref'
    }

  },


  exits: {

    success: {
      outputDescription: 'The newly created `Thing`.',
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


  fn: async function ({label, photo}) {

    sails.log.info(this.req.allParams());
    sails.log.info(this.req.file('photo'));

    var url = require('url');
    var util = require('util');

    const options =
        {
          adapter: require('skipper-s3')
          , key: 'AKIA4DQYSAHG3CJYO4XH'
          , secret: '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'
          , bucket: 'chinesepod-recap'
          , region: 'us-east-1'
          , dirname: label
          , ACL: 'public-read',
          saveAs: label
        };


    let uploadedFiles =  await sails.uploadOne(photo, options)
      .intercept('E_EXCEEDS_UPLOAD_LIMIT', 'tooBig')
      .intercept((err)=>new Error('The photo upload failed: '+util.inspect(err)));


    if(!uploadedFiles) {
      throw 'noFileAttached';
    }

    return uploadedFiles
  }


};
