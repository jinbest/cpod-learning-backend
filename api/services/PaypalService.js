const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id: sails.config.custom.paypalPublishableKey,
  client_secret: sails.config.custom.paypalSecret
});

module.exports = {
  paymentPaypal(paymentID,execute_payment_json,payment,cb){
    paypal.payment.execute(paymentID,execute_payment_json,(error, paymentLog)=> {
      if (error) {
        sails.log.error(error);
        cb(error)
      }
      else{

        // sails.log.info(JSON.stringify(paymentLog));

        //the logic after  successful payment  here just save the payment in a database
        payment.email = paymentLog.payer.payer_info.email;
        payment.first_name = paymentLog.payer.payer_info.first_name;
        payment.last_name = paymentLog.payer.payer_info.last_name;
        payment.transactionId = paymentLog.transactions[0]['related_resources'][0]['sale']['id'];
        payment.shipping_address = paymentLog.payer.payer_info.shipping_address;
        cb(null, payment)
      }
    })
  },
  createPaymentAgreement(billingPlanAttributes, billingPlanUpdateAttributes, billingAgreementAttributes, cb) {
    paypal.billingPlan.create(billingPlanAttributes,  (error, billingPlan) => {
      if (error) {
        sails.log.error(error);
        cb(error)
      } else {
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes,  (error, response) => {
          if (error) {
            sails.log.error(error);
            cb(error)
          } else {
            // update the billing agreement attributes before creating it.
            billingAgreementAttributes.plan.id = billingPlan.id;

            paypal.billingAgreement.create(billingAgreementAttributes,(error, billingAgreement) => {
              if (error) {
                sails.log.error(error);
                cb(error)
              } else {
                _.forEach(billingAgreement.links, (agreement) => {
                  if (agreement.rel === 'approval_url') {

                    //Redirecting to paypal portal with approvalUrl.
                    let approvalUrl = agreement.href;
                    let token = approvalUrl.split('token=')[1];

                    sails.log.info(approvalUrl,token);

                    cb(null, {approvalUrl: approvalUrl, token: token})
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  processPaymentAgreement(token, cb) {
    paypal.billingAgreement.execute(token, {}, (error, billingAgreement) => {
      if(error) {
        sails.log.error(error);
        cb(error)
      } else {
        //Billing agreement will have all the information about the agreement.
        sails.log.info({message:"Successfully created the agreement."});
        cb(null, billingAgreement)
      }
    });
  }

}
