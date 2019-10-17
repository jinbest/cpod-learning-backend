module.exports.apianalytics = {
  onRequest: function (report, req) {
    const ignore = [
      '/api/v1/health/time'
    ];

    if(!ignore.includes(req.path)) {
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
          timeout: 60000
        }
      );
    }
  },
};
