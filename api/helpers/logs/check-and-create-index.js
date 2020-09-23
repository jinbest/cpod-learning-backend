module.exports = {


  friendlyName: 'Check and create index',


  description: '',


  inputs: {
    elasticIndex: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    const { body } = await sails.hooks.elastic.client.indices.exists({index: inputs.elasticIndex});

    if (!body) {
      await sails.hooks.elastic.client.indices.create({
        index: inputs.elasticIndex,
        body: {
          settings: {
            "opendistro.index_state_management.policy_id": "hot_warm_remove_90"
          }
        }
      })
    }
  }


};

