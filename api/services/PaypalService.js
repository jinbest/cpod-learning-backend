const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id: sails.config.custom.paypalPublishableKey,
  client_secret: sails.config.custom.paypalSecret
});

const moment = require('moment');

//Atributes for creating the billing plan of  a user.
let billingPlanAttributes = {
  "description": " Add about subscription details.",
  "merchant_preferences": {
    "auto_bill_amount": "yes",
    "cancel_url": "http://localhost:3000/cancel",
    "initial_fail_amount_action": "continue",
    "max_fail_attempts": "1",
    "return_url": "http://localhost:3000/success",
    "setup_fee": {
      "currency": "USD",
      "value": "1"
    }
  },
  "name": "Paypal Agreement",
  "payment_definitions": [
    {
      "amount": {
        "currency": "USD",
        "value": "25"
      },
      "charge_models": [],
      "cycles": "0",
      "frequency": "MONTH",
      "frequency_interval": 1,
      "name": "Regular Payments",
      "type": "REGULAR"
    }
  ],
  "type": "INFINITE"
};

//Once a billing plan is created it must be updated with the following attributes.
let billingPlanUpdateAttributes = [
  {
    "op": "replace",
    "path": "/",
    "value": {
      "state": "ACTIVE"
    }
  }
];

//Attributes for creating the billing agreement.
//Start Date should be greater than current time and date.
let startDate = moment(new Date()).add(10, 'minute').format('gggg-MM-DDTHH:mm:ss')+'Z';
let billingAgreementAttributes = {
  "name": "Name of Payment Agreement",
  "description": "Description of  your payment  agreement",
  "start_date": startDate,
  "plan": {
    "id": ""
  },
  "payer": {
    "payment_method": "paypal"
  }
};



module.exports = {
  paymentPaypal(paymentID,execute_payment_json,payment,cb){
    paypal.payment.execute(paymentID,execute_payment_json,(error, paymentLog)=> {
      if (error) {
        sails.log.error(error);
        return cb(error)
      }
      else{

        //the logic after  successful payment  here just save the payment in a database
        payment.email = paymentLog.payer.payer_info.email;
        payment.first_name = paymentLog.payer.payer_info.first_name;
        payment.last_name = paymentLog.payer.payer_info.last_name;
        cb(null, payment)
      }
    })
  },
  createPaymentAgreement(billingPlanAttributes) {
    paypal.billingPlan.create(billingPlanAttributes,  (error, billingPlan) => {
      if (error) {
        sails.log.error(error)
      } else {
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes,  (error, response) => {
          if (error) {
            console.log(error);
          } else {
            // update the billing agreement attributes before creating it.
            billingAgreementAttributes.plan.id = billingPlan.id;

            paypal.billingAgreement.create(billingAgreementAttributes,(error, billingAgreement) => {
              if (error) {
                console.log(error);
              } else {
                _.forEach(billingAgreement.links, (agreement) => {
                  if (agreement.rel === 'approval_url') {
                    //Redirecting to paypal portal with approvalUrl.
                    let approvalUrl = agreement.href;
                    let token = approvalUrl.split('token=')[1];
                    console.log(approvalUrl,token);
                    res.redirect(approvalUrl);
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  processPaymentAgreement(token) {
    paypal.billingAgreement.execute(token, {}, (error, billingAgreement) => {
      if(error) {
        console.log(error);
      } else {
        console.log(billingAgreement);
        //Billing agreement will have all the information about the agreement.
        sails.log.info({message:"Successfully created the agreement."})
      }
    });
  }

}
