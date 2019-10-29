module.exports = {


  friendlyName: 'Count lessons',


  description: '',


  inputs: {
    userId: {
      type: 'number'
    },
    timeframe: {
      type: 'number'
    },
    email: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let lessonCount = await Logging.find({
      where: {
        id: inputs.email,
        accesslog_urlbase: {
          'in': [
            'https://chinesepod.com/lessons/api',
            'https://www.chinesepod.com/lessons/api',
            'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
            'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
          ]},
        createdAt: {
          '>': new Date(Date.now() - inputs.timeframe * 24 * 60 * 60 * 1000)
        }
      },
      select: ['accesslog_url'],
      sort: 'createdAt DESC',
    });

    return lessonCount.length

  }


};

