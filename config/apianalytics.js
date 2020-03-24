module.exports.apianalytics = {
  onRequest: function (report, req) {
    const ignore = [
      '/api/v1/health/time',
      '/api/v1/webhooks/mautic/update'
    ];

    let userId = null;

    if (req.session && req.session.userId) {
      if (req.session.userId.data) {
        userId = req.session.userId.data
      } else {
        userId = req.session.userId
      }
    }

    if(!ignore.includes(req.path)) {
      loggingQueue.add('Logging Requests',
        {
          userId: userId,
          ip: req.ip,
          url: `https://www.chinesepod.com${req.url}`,
          sessionId: req.session ? req.session.id : '',
          urlbase: `https://www.chinesepod.com${req.path}`,
          referer: req.get('referer'),
          timestamp: new Date().toISOString()
        },
        {
          attempts: 2,
          timeout: 120000,
          removeOnComplete: true
        }
      );
    }
  },
};
