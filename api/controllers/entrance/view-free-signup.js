module.exports = {


  friendlyName: 'View free signup',


  description: 'Display "Free signup" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/free-signup'
    },

    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

    let wistia = false;

    let video = `<div class="embed-responsive embed-responsive-16by9" ><iframe id="cpod-vid" width="100%" height="315" src="https://www.youtube.com/embed/UO92C1JHRI0?rel=0&amp;showinfo=0&autoplay=true" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe></div>`;

    if (this.req.me) {
      throw {redirect:'/home'};
    }

    let ipData = {};
    var geoip = require('geoip-country');

    if (this.req.ip && this.req.ip !== '::1') {
      ipData = geoip.lookup(this.req.ip);
      // ipData = geoip.lookup('42.200.130.138');
    }

    if (ipData && ['CN', 'HK'].includes(ipData.country)) {
      wistia = true;
      video = `<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_fwg1oypcj5 seo=false videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/fwg1oypcj5/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>`;
    }

    return {
      video: video,
      wistia: wistia
    };

  }


};
