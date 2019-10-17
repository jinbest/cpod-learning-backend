module.exports.apianalytics = {
  onRequest: function (report, req) {
    sails.hooks.jobs.loggingQueue.add('Logging Requests',
      {
        userId: req.session.userId,
        ip: req.ip,
        url: `https://www.chinesepod.com${req.url}`,
        sessionId: req.session.id,
        urlbase: `https://www.chinesepod.com${req.path}`,
        referer: req.get('referer')
      },
      {
        attempts: 2,
        timeout: 20000
      });
  },
};
