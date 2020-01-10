if (process.env.NODE_ENV !== 'production' || process.env.sails_environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var loggingQueue = new Queue('LoggingQueue', sails.config.jobs.url);

  loggingQueue.on('ready', () => {
    sails.log.info('loggingQueue ready!');
  });
  loggingQueue.on('failed', (job, e) => {
    sails.log.error('loggingQueue failed:', job.id, e);
  });

  loggingQueue.process('Logging Requests', 100,async function (job, done) {
    if (!job.data) {
      done( null, 'No job data')
    }
    let userData = {};

    if (job.data.userId) {
      try {
        userData = await sails.models['user'].findOne({id: job.data.userId});
      } catch (e) {
        sails.log.error(e);
        done(e)
      }
    }

    let ipData = {};

    if(job.data.ip && job.data.ip !== '::1' && [
      'https://www.chinesepod.com/dash',
      'https://www.chinesepod.com/home',
      'https://www.chinesepod.com/signup',
      'https://www.chinesepod.com/checkout'].includes(job.data.urlbase)) {
      const IPData =  require('ipdata').default;
      const ipdata = new IPData(sails.config.custom.ipDataKey);
      await ipdata.lookup(job.data.ip)
        .then((info) => {ipData = info})
        .catch((err) => sails.log.error(err));
    }

    if ([
      'https://www.chinesepod.com/dash',
      'https://www.chinesepod.com/home',
      'https://www.chinesepod.com/signup',
      'https://www.chinesepod.com/checkout',
      'https://www.chinesepod.com/login'
    ].includes(job.data.urlbase) || (userData && userData.email)) {
      await Logging.create({
        id: userData.email ? userData.email : 'NONE',
        access_ip: job.data.ip,
        accesslog_url: job.data.url,
        accesslog_sessionid: job.data.sessionId,
        accesslog_urlbase: job.data.urlbase,
        accesslog_country: ipData['country_name'] ? ipData['country_name'] : null,
        referer: job.data.referer
      });
      done(null, userData.email ? `Logged Request for User: ${userData.email}` : `Logged Request for Unknown User`)
    } else {
      done(null, 'Ignoring this log')
    }
  });

  module.exports = loggingQueue;
}

