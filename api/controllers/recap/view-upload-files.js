module.exports = {


  friendlyName: 'View upload files',


  description: 'Display "Upload files" page.',

  inputs: {
    lessonId: {
      type: 'string'
    }
  },


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/upload-files'
    }

  },


  fn: async function (inputs) {

    // Respond with view.
    return {
      formData: {
        lessonId: inputs.lessonId
      }
    };

  }


};
