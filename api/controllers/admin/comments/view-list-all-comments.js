module.exports = {


  friendlyName: 'View list all comments',


  description: 'Display "List all comments" page.',

  inputs: {

    page: {
      type: 'number',
      isInteger: true
    }

  },

  exits: {

    success: {
      viewTemplatePath: 'pages/admin/comments/list-all-comments'
    }

  },


  fn: async function (inputs) {

    const pageSize = 20;

    sails.log.info(inputs);

    // Respond with view.
    return {
      comments: await Comments.find().sort('createdAt DESC').limit(pageSize).skip(inputs.page ? inputs.page * pageSize : 0).populate('parent_id').populate('user'),
      page: inputs.page ? inputs.page : 1,
      totalPages: Math.ceil(await Comments.count() / 20)
    };

  }


};
