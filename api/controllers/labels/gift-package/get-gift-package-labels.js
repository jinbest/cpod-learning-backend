module.exports = {


  friendlyName: 'Get gift package labels',


  description: '',


  inputs: {

    country: {
      type: 'string',
      required: true
    },
    size : {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    const startDate = new Date ('2019-11-04');

    let sentPackages = (await GiftTracking.find().select(['id'])).map((item) => {return item.id});

    let oldTransactions = require('../../../../lib/oldTransactions.json');

    // let oldTransactions = (await sails.sendNativeQuery(`SELECT distinct t.user_id FROM chinesepod_production.transactions t WHERE t.pay_status=2 AND t.date_created < '2019-11-04'`))['rows'];
    // const fs = require('fs');
    // oldTransactions = oldTransactions.map(transaction => {return transaction.user_id});
    // sails.log.info(oldTransactions.slice(0, 5));
    // fs.writeFileSync('lib/oldTransactions.json', JSON.stringify(oldTransactions));

    let relevantTransactions = await Transactions.find({
      where: {
        user_id: {
          nin: sentPackages.concat(oldTransactions)
        },
        pay_status: 2,
        is_recurring_payment: 0,
        createdAt: {
          '>=': startDate
        }
      }
    });

    relevantTransactions = _.uniq(relevantTransactions, function (item) {
      return item.user_id
    });

    relevantTransactions = relevantTransactions.map(transaction => {return transaction.id});

    let addresses = await TransactionAddresses.find({
      where: {
        country: inputs.country,
        updatedAt: {
          '>=': startDate
        },
        transaction_id: {
          in: relevantTransactions
        }
      },
      select: ['transaction_id', 'country', 'state', 'city', 'zip_code', 'full_name', 'address1', 'address2'],
      sort: 'updatedAt DESC'
    });

    const europeanAddresses = ['AT', 'BE', 'CH', 'DE', 'DK', 'FR', 'FI', 'NL', 'PT', 'RU', 'SE', 'NO', 'UA', 'UK'];

    const asiaAddresses = ['HK', 'CN', 'TW'];

    addresses.forEach(address => {
      let ship_from = `ChinesePod LLC  |  246 West Broadway  |  New York NY 10013`;
      if (europeanAddresses.includes(address.country.toUpperCase())) {
        ship_from = `ChinesePod  |  P.O. Box 92002  |  NL-1090 AA Amsterdam`;
      } else if (asiaAddresses.includes(address.country.toUpperCase())) {
        ship_from = `ChinesePod Limited  |  General Post Office Box 7347  |  Hong Kong S.A.R.`;
      } else if ('PH' === address.country.toUpperCase()) {
        ship_from = `Lapu-Lapu City Post Office Box 16  |  6015 Lapu-Lapu City  |  Philippines`;
      }

      address.ship_from = ship_from;
      address.ship_to = `${address.address1.length > 0 ? address.address1 + '\n' : ''}${address.address2.length > 0 ? address.address2 + '\n' : ''}${address.city ? address.city : ''} ${address.state ? address.state : ''} ${address.zip_code ? address.zip_code : ''}`;

    });

    return {
      total: addresses.length,
      country: inputs.country,
      addresses: addresses.slice(0, inputs.size ? inputs.size : 5)
    }
  }


};
