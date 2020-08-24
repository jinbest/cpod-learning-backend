module.exports = {


  friendlyName: 'Sitemap',


  description: 'Sitemap something.',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let sitemapDict = require('../../../lib/cedict_sitemaps.json');

    let sliceSize = 5000;

    let dictionaryPages = Math.ceil(sitemapDict.length / sliceSize)

    let sitemapXml = `
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/pages</loc>
        </sitemap>
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/lessons</loc>
        </sitemap>
    `;

    for (let i = 0; i < dictionaryPages; i++) {
      sitemapXml += `
        <sitemap>
          <loc>https://www.chinesepod.com/sitemaps/dictionary/${i + 1}</loc>
        </sitemap>
      `
    }

    sitemapXml += `</sitemapindex>`

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
