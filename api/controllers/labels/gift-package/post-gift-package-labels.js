module.exports = {


  friendlyName: 'Post gift package labels',


  description: '',


  inputs: {
    // type: ['{}']
    // transaction_id: {
    //   type: 'number',
    // },
    // address: {
    //   type: 'string',
    // },
    batch: {
      type: ['ref'],
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    try {

      let transactions = inputs.batch.map((gift) => {return gift.transaction_id});

      const sentDate = new Date();

      await asyncForEach(inputs.batch, async (shipment) => {
        let userInfo = await Transactions.findOne({id: shipment.transaction_id});
        shipment.id = userInfo.user_id;
        shipment.sentDate = sentDate;
      });

      sails.log.info(inputs.batch);

    } catch (e) {
      throw 'invalid'
    }

    return await GiftTracking.createEach(inputs.batch);

  }


};
