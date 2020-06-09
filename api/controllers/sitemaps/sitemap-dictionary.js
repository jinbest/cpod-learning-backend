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
    let now = moment(new Date())
    let diff = now.diff(start, 'days');

    let sliceSize = 30000;
    if (diff < 31) {
      sliceSize = Math.pow(diff, 3);
    }

    let startPoint = (inputs.id - 1) * dictionarySplitBatch;

    let dictSlice = sitemapDict.slice(startPoint, startPoint + sliceSize);

    let sitemapXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    dictSlice.forEach((entry) => {
      sitemapXml += (
          '<url>\n'+
          '  <loc>https://www.chinesepod.com/dictionary/' + _.escape(entry.simplified)+'</loc>\n'+
          '  <lastmod>'+_.escape(new Date().toISOString())+'</lastmod>\n'+
          '<changefreq>monthly</changefreq>\n'+
          '</url>'
        );
    });

    sitemapXml += '</urlset>';

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
