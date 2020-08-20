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

    const moment = require('moment');

    let dictionarySplitBatch = 30000;

    //TODO Store this for reuse
    // PREPARE DICT FOR SITEMAPS
    // const fs = require('fs');
    // let uniqueDict = _.uniq(dict, 'simplified')
    // fs.writeFile('cedict_sitemaps.json', JSON.stringify(uniqueDict), console.log);

    let dict = require('../../../lib/cedict.json');
    let sitemapDict = require('../../../lib/cedict_sitemaps.json');

    let start = moment(new Date('2020-06-01'))
    let modified = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    let now = moment(new Date())
    let diff = now.diff(start, 'days');

    let sliceSize = 30000;
    if (diff < 11) {
      sliceSize = Math.pow(diff, 3);
    } else if (diff < 16) {
      sliceSize = 1000 + Math.floor(Math.pow(diff, 2.8));
    } else if (diff < 24) {
      sliceSize = 2000 + Math.floor(Math.pow(diff, 2.7));
    } else if (diff < 59) {
      sliceSize = 3000 + Math.floor(Math.pow(diff, 2.5));
    }

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
