module.exports = {


  friendlyName: 'Sitemap',


  description: 'Sitemap something.',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let sitemapXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    [
      '',
      'signup',
      'corporate',
      'academic-offers',
      'start-learning-chinese',
      'start-learning-mandarin',
      'why-choose-us',
      'pricing',
    ]
      .forEach((page) => {
      sitemapXml += (
          '<url>\n'+
          '  <loc>https://www.chinesepod.com/' + _.escape(page)+'</loc>\n'+
          '  <lastmod>'+_.escape(new Date().toISOString())+'</lastmod>\n'+
          '<changefreq>weekly</changefreq>\n'+
          '<priority>1.0</priority>\n'+
          '</url>'
        );
    });

    sitemapXml += '</urlset>';

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
