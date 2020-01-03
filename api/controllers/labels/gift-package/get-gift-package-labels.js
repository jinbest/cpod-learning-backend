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

    const startDate = new Date ('2019-12-20');

    let sentPackages = (await GiftTracking.find().select(['id'])).map((item) => {return item.id});

    let relevantTransactions = await Transactions.find({
      where: {
        user_id: {
          nin: sentPackages
        },
        is_recurring_payment: 0,
        createdAt: {
          '>=': startDate
        }
      }
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

    return {
      total: addresses.length,
      country: inputs.country,
      addresses: addresses.slice(0, inputs.size ? inputs.size : 5)
    }
  }


};
