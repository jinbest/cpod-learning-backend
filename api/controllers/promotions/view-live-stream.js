module.exports = {


  friendlyName: 'View live stream',


  description: 'Display "Live stream" page.',


  exits: {


  },


  fn: async function () {

    // const axios = require('axios');
    //
    // const CPOD = 'UCRY8eBLd9tPFw5-JY7S7O8Q';
    //
    // let YTdata = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CPOD}&eventType=live&type=video&key=AIzaSyDQ0ndgh3kpp4yPZJGxl5tt3vS1Y5iYK_k`)
    //   .then(({data}) => {return data})
    //   .catch((e) => sails.log.error(e));

    let stream = await Livestream.find({startTime: {
        '>': new Date(Date.now() + 30 * 60 * 1000)
      }}).sort('startTime ASC').limit(1);

    sails.log.info(stream);

    // let countdown = new Date('Feb 15 2020 17:00:00 EST');

    // return this.res.redirect('https://www.youtube.com/watch?v=' + YTdata.items[0]['id']['videoId'])

    if (stream && stream[0] && stream[0]['startTime']) {

      return this.res.view('pages/promotions/live-stream',{stream: stream[0], countdown: stream[0]['startTime'], isLiveStream: true})

    } else {

      return this.res.view('pages/promotions/live-stream',{isLiveStream: false})

    }



  }


};
