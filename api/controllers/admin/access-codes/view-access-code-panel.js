module.exports = {


  friendlyName: 'View access code panel',


  description: 'Display "Access code panel" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/access-codes/access-code-panel'
    }

  },


  fn: async function () {

    let voucherCodes = await AccessVoucherCodes.find().populate('redeemed_by').limit(500).skip(this.req.param('page') ? this.req.param('page') * 100 : 0).sort('createdAt DESC');

    // Respond with view.
    return {
      voucherCodes: voucherCodes
    };

  }


};
