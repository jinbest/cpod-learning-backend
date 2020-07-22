module.exports = {


  friendlyName: 'Upload avatar',


  description: '',

  files: ['file'],

  inputs: {
    userId: {
      type: 'number'
    },
    file: {
      description: 'Upstream for an incoming file upload.',
      type: 'ref',
      required: true
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


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if(!inputs.file) {
      throw 'noFileAttached';
    }

    var util = require('util');

    let options =
      {
        adapter: require('skipper-better-s3')
        , key: sails.config.custom.awsKey
        , secret: sails.config.custom.awsSecret
        , bucket: 'chinesepod-user-profiles'
        , region: 'us-east-1'
        , dirname: `profiles/${inputs.userId}`
        , s3params:
          { ACL: 'public-read'
          }
        , onProgress: progress => sails.log.verbose('Upload progress:', progress)
      };

    let uploadedFiles = await sails.uploadOne(inputs.file, options)
      .intercept('E_EXCEEDS_UPLOAD_LIMIT', 'tooBig')
      .intercept((err)=>new Error('The photo upload failed: '+util.inspect(err)));

    sails.log.info(uploadedFiles);

    if(!uploadedFiles) {
      throw 'noFileAttached';
    }

    await UserPreferences.updateOrCreate({id: inputs.userId}, {
      user_id: inputs.userId,
      avatar_url: uploadedFiles.extra.Location,
      last_login_ip: this.req.ip
    });

    return {success: 1}
  }


};
