module.exports = {


  friendlyName: 'Paypal',


  description: 'Paypal webhooks.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info({paypalWebhook: this.req.body});

    let payload = this.req.body

    if (payload && payload.event_type) {
      switch (payload.event_type) {
        case 'PAYMENT.SALE.COMPLETED':
          sails.log.info({paypalTransaction: payload.summary});
          let transaction = (await Transactions.find({subscription_id: payload.resource.billing_agreement_id})
            .limit(1))[0];
          if (!transaction) {
            sails.log.error(`Unknown subscription ${payload.resource.billing_agreement_id}`);
            sails.helpers.bugsnag.notify(`Unknown subscription ${payload.resource.billing_agreement_id}`);
            break;
          }

          await Transactions.create({
            subscription_id: transaction.subscription_id,
            user_id: transaction.user_id,
            product_id: transaction.product_id,
            product_length: transaction.product_length,
            product_price: transaction.product_price,
            discount: 0,
            billed_amount: payload.resource.amount.total,
            promotion_code: null,
            pay_status: 2, // Paid
            pay_method: 10,
            notes: 'CPOD JS PAGE',
            region: null,
            country: null,
            city: null,
            ip_address: this.req.ip,
            created_by: transaction.user_id,
            modified_by: transaction.user_id,
          });

          //TODO UPDATE SUBSCRIPTION && UPDATE ACCESS
          // await Subscriptions.updateOne({subscription_id: transaction.subscription_id})
          //   .set()

        default:
          break;
      }
    }

  }


};
