module.exports = {


  friendlyName: 'View live stream',


  description: 'Display "Live stream" page.',


  exits: {


  },


  fn: async function () {

    const axios = require('axios');

    const CPOD = 'UCRY8eBLd9tPFw5-JY7S7O8Q';

    let YTdata = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CPOD}&eventType=live&type=video&key=AIzaSyDQ0ndgh3kpp4yPZJGxl5tt3vS1Y5iYK_k`)
      .then(({data}) => {return data})
      .catch((e) => sails.log.error(e));

    if (YTdata && YTdata.items.length > 0) {

      return this.res.redirect('https://www.youtube.com/watch?v=' + YTdata.items[0]['id']['videoId'])

    } else {

      let countdown = new Date('Feb 13 2020 12:00:00 EST');

      // Respond with view.
      return this.res.view('pages/promotions/live-stream',{countdown: countdown})

    }


  }


};
