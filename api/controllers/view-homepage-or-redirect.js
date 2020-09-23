module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',

  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    },

  },


  fn: async function () {
    let wistia = false;

    let video = `<div class="embed-responsive embed-responsive-16by9" ><iframe id="cpod-vid" width="100%" height="315" src="https://www.youtube.com/embed/NjCYc5p8a5c?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe></div>`;

    if (this.req.me) {
      throw {redirect:'/home'};
    }

    let ipData = {};
    var geoip = require('geoip-country');

    if (this.req.ip && this.req.ip !== '::1') {
      ipData = geoip.lookup(this.req.ip);
    }

    if (ipData && ['CN', 'HK'].includes(ipData.country)) {
      wistia = true;
      video = `<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_jggideab2x seo=false videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/jggideab2x/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>`;
    }

    if (this.req.param('campaignId')) {
      this.req.session.campaignId = this.req.param('campaignId').toUpperCase();
    }

    return {
      title: 'Start Learning Chinese Today with ChinesePod!',
      video: video,
      wistia: wistia
    };

  }


};
