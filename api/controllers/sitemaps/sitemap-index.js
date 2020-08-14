module.exports = {


  friendlyName: 'Sitemap',


  description: 'Sitemap something.',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let sitemapXml = `
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/pages</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/lessons</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/dictionary/1</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/dictionary/2</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/dictionary/3</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/dictionary/4</loc>
        </sitemap>
      </sitemapindex>
    `;

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
