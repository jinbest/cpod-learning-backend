module.exports = {


  friendlyName: 'View promo',


  description: 'Display "Promo" page.',

  inputs: {
    annual: {
      type: 'boolean'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    let promoCode = '74FB50';
    let validPromos = await PromoCodes.find({promotion_code: promoCode, product_id: {in: [140, 2, 18, 142, 13, 14]}, expiry_date: {'>': new Date()}})

    if (!Array.isArray(validPromos) || !validPromos.length) {
      return this.res.view('pages/promotions/expired-promo')
    }

    // Respond with view.
    return this.res.view('pages/promotions/independence-day/74fb50',{
      layout: 'layouts/layout-promo',
      promoUrl: `/july-4/74FB50`
    });

  }


};