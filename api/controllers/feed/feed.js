module.exports = {


  friendlyName: 'Feed',


  description: 'Feed rss.',


  inputs: {

    feedType: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    const Feed = require('feed').Feed;

    const feed = new Feed({
      title: "ChinesePod Lesson Feed",
      description: "Mandarin Chinese Lessons for Busy People",
      id: "https://www.chinesepod.com/",
      link: "https://www.chinesepod.com/",
      language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
      image: "https://www.chinesepod.com/images/brand/logo.png",
      favicon: "https://www.chinesepod.com/favicon.ico",
      copyright: "© 2020 ChinesePod LLC",
      generator: "awesome", // optional, default = 'Feed for Node.js'
      feedLinks: {
        json: "https://www.chinesepod.com/feed/json",
        atom: "https://www.chinesepod.com/feed/atom"
      },
      author: {
        name: "ChinesePod LLC",
        email: "team@chinesepod.com",
        link: "https://www.chinesepod.com"
      }
    });

    function prepareContributors (hosts) {
      if (hosts.length > 0) {
        let returnData = []; let hostData = hosts.split(',');
        hostData.forEach(host => {
          returnData.push({
            name: host,
            email: `${host.toLowerCase()}@chinesepod.com`,
            link: `https://www.chinesepod.com/explore?query=${host}`
          })
        });
        return returnData
      }
    }

    await LessonData.stream({
      where: {
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'publish'
      },
      sort: 'publication_timestamp DESC',
      limit: 100
    })
      .eachRecord((lesson) => {
        feed.addItem({
          title: lesson.title,
          id: `https://www.chinesepod.com/lesson/${lesson.slug}`,
          link: `https://www.chinesepod.com/lesson/${lesson.slug}`,
          image: `https://s3contents.chinesepod.com/${lesson.type === 'extra' ? 'extra/' : ''}${lesson.id}/${lesson.hash_code}/${lesson.image}`,
          description: lesson.description,
          author: [{
            name: 'ChinesePod',
            email: 'team@chinesepod.com',
            link: 'https://www.chinesepod.com'
          }],
          contributor: prepareContributors(lesson.hosts),
          date: lesson.publication_timestamp
        });
      });

    switch (inputs.feedType) {

      case 'json':
        return this.res.set({'Content-Type': 'application/json'}).send(feed.json1());

      case 'atom':
        return this.res.set({'Content-Type': 'application/xml'}).send(feed.atom1());

      default:
        return this.res.set({'Content-Type': 'application/xml'}).send(feed.rss2());

    }
  }


};
