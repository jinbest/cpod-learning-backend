module.exports = {


  friendlyName: 'Generate',


  description: 'Generate access codes.',


  inputs: {
    amount: {
      type: 'number',
      isInteger: true,
      required: true
    },
    accessLength: {
      type: 'number',
      isInteger: true,
      required: true
    },
    access_type: {
      type: 'string',
      required: true
    },
    expiry: {
      type: 'string'
    }


  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.

    let amount = inputs.amount ? inputs.amount : 1;

    let dataToCreate = [];

    for (let step = 0; step < amount; step++) {
      dataToCreate.push({
        code: '',
        access_type: '',
        accessLength: inputs.accessLength,
        created_by: this.req.me ? this.req.me.email : 'me@chinesepod.com',
        expires: !!inputs.expiry,
        expiry: inputs.expiry ? inputs.expiry: null
      })
    }

    return await AccessVoucherCodes.createEach(dataToCreate).fetch();

  }


};
