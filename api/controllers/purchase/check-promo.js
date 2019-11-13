module.exports = {


  friendlyName: 'Check promo',


  description: 'Check the validity of a ChinesePod Promo Code',

  inputs: {
    emailAddress: {
      type: 'string'
    },
    userId: {
      type: 'number'
    },
    fName: {
      type: 'string'
    },
    lName: {
      type: 'string'
    },
    promoCode: {
      type: 'string',
      description: 'A promo code issued by ChinesePod.',
      required: true
    },
    plan: {
      type: 'string',
      required: true
    },
    billingCycle: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    const plans = {
      premium: {
        id: 5,
        type: 2,
        monthly: {
          id: 2,
          stripeId: 'Monthly Plan -2',
          length: 1,
        },
        quarterly: {
          id: 18,
          stripeId: 'Quarterly Plan -18',
          length: 3,
        },
        annually: {
          id: 140,
          stripeId: 'Annual Plan -140',
          length: 12,
        },
        monthlyTrial: {
          id: 271,
          stripeId: 'Monthly Plan -271',
          length: 1
        }
      },
      basic: {
        id: 6,
        type: 1,
        monthly: {
          id: 13,
          stripeId: 'Monthly Plan -13',
          length: 1,
        },
        quarterly: {
          id: 14,
          stripeId: 'Quarterly Plan -14',
          length: 3,
        },
        annually: {
          id: 142,
          stripeId: 'Annual Plan -142',
          length: 12,
        }
      },
      class: {
        //Nothing Yet
      }
    };

    let response = await sails.helpers.promo.checkCode.with({
      promoCode: inputs.promoCode,
      productId: plans[inputs.plan][inputs.billingCycle].id
    });
    if (response.success) {
      return {
        success: true,
        discount: {
          type: response.data.type,
          value: response.data.value,
          plan: inputs.plan,
          billingCycle: inputs.billingCycle
        }
      }
    } else {

      sails.log.info(response.data);

      if (!inputs.emailAddress && this.req.me) {
        inputs.emailAddress = this.req.me.email
      }

      if (!inputs.fName && !inputs.lName && this.req.me) {
        inputs.name = this.req.me.name
      }

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: `
            <p>Failed to Apply a Promo Code on https://www.chinesepod.com</p>
            <br />
            ${inputs.fName || inputs.lName ? `<p>Name: ${inputs.fName} ${inputs.lName}</p>` : inputs.name ? `<p>Name: ${inputs.name}<p/>` : ''}
            <p>Email: ${inputs.emailAddress ? inputs.emailAddress : 'Anonymous User'}</p>
            <br />
            <p>Code: ${inputs.promoCode}</p>
            <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
            <p>Error: ${response.error}</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
        to: 'ugis@chinesepod.com',
        subject: 'Failed Promo Code',
        from: 'errors@chinesepod.com',
        fromName: 'ChinesePod Errors'
      });


      return {
        error: response.error,
        data: response.data ? response.data : false
      }
    }
  }



};
