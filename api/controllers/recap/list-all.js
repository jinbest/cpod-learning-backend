module.exports = {


  friendlyName: 'List all',


  description: '',


  inputs: {

  },


  exits: {

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

    // Assuming there is a directory named 'avatars' in your bucket root...
    let data = [];
    await adapter.ls('', (err, files) => {
      // files is now an array of paths, relative to the given directory name
      console.log(files);
      data = files;
    });
    console.log(data);
    return data;
  }
};
