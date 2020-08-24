module.exports = {


  friendlyName: 'View access code panel',


  description: 'Display "Access code panel" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/academic-codes/academic-code-panel'
    }

  },


  fn: async function () {

    let voucherCodes = await AccessAcademicCodes
      .find()
      .limit(500)
      .skip(this.req.param('page') ? this.req.param('page') * 100 : 0)
      .sort('createdAt DESC')
      .populate('redeemed_by')
    ;

    voucherCodes.forEach(voucher => {
      if (voucher.redeemed_by && voucher.redeemed_by.email) {
        voucher.redeemed_by = voucher.redeemed_by.email
      }
    })

    // Respond with view.
    return {
      voucherCodes: voucherCodes
    };

  }


};
