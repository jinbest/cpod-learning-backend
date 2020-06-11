module.exports = {


  friendlyName: 'Sitemap',


  description: 'Sitemap something.',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let sitemapXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    await LessonData.stream({
      where: {
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'publish'
      },
      select: ['updatedAt', 'slug'],
      sort: 'publication_timestamp DESC',
      limit: 50000
    })
      .eachRecord((lesson) => {
      sitemapXml += (
          '<url>\n'+
          '  <loc>https://www.chinesepod.com/lesson/' + _.escape(lesson.slug)+'</loc>\n'+
          '  <lastmod>'+_.escape(lesson.updatedAt.toISOString())+'</lastmod>\n'+
          '<changefreq>weekly</changefreq>\n'+
          '</url>'
        );
    });

    sitemapXml += '</urlset>';

    return this.res.set({'Content-Type': 'application/xml'}).send(sitemapXml)
  }
};
