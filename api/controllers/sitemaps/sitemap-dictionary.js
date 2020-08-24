module.exports = {


  friendlyName: 'Sitemap',


  description: 'Sitemap something.',


  inputs: {
    id: {
      type: 'number',
      isInteger: true,
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    let dictionarySplitBatch = 5000;

    //TODO Store this for reuse
    // PREPARE DICT FOR SITEMAPS
    // const fs = require('fs');
    // let uniqueDict = _.uniq(dict, 'simplified')
    // fs.writeFile('cedict_sitemaps.json', JSON.stringify(uniqueDict), console.log);

    let sitemapDict = require('../../../lib/cedict_sitemaps.json');

    let modified = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

    let sliceSize = 5000;

    let startPoint = (inputs.id - 1) * dictionarySplitBatch;

    let dictSlice = sitemapDict.slice(startPoint, startPoint + sliceSize);

    let sitemapXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    dictSlice.forEach((entry) => {
      sitemapXml += (
          '<url>\n'+
          '  <loc>https://www.chinesepod.com/dictionary/' + _.escape(entry.simplified)+'</loc>\n'+
          '  <lastmod>'+_.escape(modified.toISOString())+'</lastmod>\n'+
          '<changefreq>monthly</changefreq>\n'+
          '<priority>0.8</priority>\n'+
          '</url>'
        );
    });

    sitemapXml += '</urlset>';

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
