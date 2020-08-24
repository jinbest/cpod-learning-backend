module.exports = {


  friendlyName: 'View valentines day gift redeem',


  description: 'Display "Valentines day gift redeem" page.',

  inputs: {
    code: {
      type: 'string'
    },
    userCode: {
      type: 'string'
    }
  },

  exits: {

  },


  fn: async function (inputs) {

    const plans = [
      {
        id: 2,
        stripeId: 'Monthly Plan -2',
        length: 1,
        price: 29.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 18,
        stripeId: 'Quarterly Plan -18',
        length: 3,
        price: 79.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 140,
        stripeId: 'Annual Plan -140',
        length: 12,
        price: 249.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 13,
        stripeId: 'Monthly Plan -13',
        length: 1,
        price: 14.00,
        level: 'basic',
        levelId: 6
      },
      {
        id: 142,
        stripeId: 'Annual Plan -142',
        length: 12,
        price: 124.00,
        level: 'basic',
        levelId: 6
      },
      {
        id: 14,
        stripeId: 'Quarterly Plan -14',
        length: 3,
        price: 39.00,
        level: 'basic',
        levelId: 6
      }
    ];

    sails.log.info(inputs);

    if (inputs.userCode) {

      let userData = await User.findOne({code: inputs.userCode});

      if (!userData) {

        return this.res.redirect(`/redeem-gift${inputs.code ? `/${inputs.code}` : ''}`)

      } else {

        this.req.session.userId = userData.id;
        this.req.me = userData;

        await User.updateOne({id: userData.id})
          .set({confirm_status: 1})
      }

    }

    if (this.req.session.userId) {

      if (!inputs.code) {
        return this.res.view('pages/redeem/gift/redeem');
      }

      // CHECK CODE VALIDITY
      let voucher = await Vouchers.findOne({voucher_code: inputs.code, code_status: 1, expiry_date: {'>=': new Date()}});

      if (!voucher) {

        // INVALID VOUCHER
        return this.res.view('pages/redeem/gift/redeem', {formData: {code: inputs.code}})

      }

      inputs.userId = this.req.session.userId;

      sails.log.info(inputs.userId);

      // CHECK FOR SUBSCRIPTIONS
      let userSiteLinks = await UserSiteLinks.find({user_id: inputs.userId, site_id: 2})
        .sort('updatedAt DESC')
        .limit(1);

      sails.log.info(userSiteLinks);

      //IF NO CONFLICTS -> APPLY PROMO AND ROUTE TO SUCCESS
      if (userSiteLinks && userSiteLinks.length > 0 && userSiteLinks[0]['usertype_id'] !== 7) {

        sails.log.info('Confirm Path');

        let plan = (plans.filter(i => i.id === voucher.product_id))[0];

        return this.res.view('pages/redeem/gift/confirm',{
          formData: {
            code: inputs.code,
            expiry: voucher.expiry_date,
            plan: _.capitalize(plan.level),
            productLength: `${plan['length']} month${plan['length'] > 1 ? 's' : ''}`
          }
        })

      } else {

        let plan = (plans.filter(i => i.id === voucher.product_id))[0];

        let moment = require('moment');

        let expiry = moment(new Date()).add(plan['length'], 'months').toDate();

        sails.log.info({plan: plan, expiry: expiry});


        if (userSiteLinks && userSiteLinks.length > 0) {

          await UserSiteLinks.update({user_id: inputs.userId, site_id: 2})
            .set({
              usertype_id: plan.levelId,
              expiry: expiry,
              signup_user_agent: this.req.headers['user-agent']
            });

        } else {

          await UserSiteLinks.create({
            user_id: inputs.userId,
            site_id: 2,
            usertype_id: plan.levelId,
            expiry: expiry,
            signup_user_agent: this.req.headers['user-agent']
          });

        }

        await Vouchers.updateOne({id: voucher.id})
          .set({
            code_status: 0,
            redeemed_by: inputs.userId
          });

        return this.res.redirect('/redeem-gift/success')

      }

    } else {

      return this.res.redirect('/login?continue=' + `/redeem-gift${inputs.code ? `/${inputs.code}` : ''}`);

    }

  }


};
