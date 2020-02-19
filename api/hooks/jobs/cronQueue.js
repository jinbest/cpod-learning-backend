if (process.env.NODE_ENV !== 'production' || sails.config.environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var triggerQueue = new Queue('TriggerQueue', sails.config.jobs.url);

  triggerQueue.process('ReindexLessons', 1, async function (job) {
    await sails.helpers.search.reindexLessons();
    await sails.helpers.search.reindexCourses();
  });
  triggerQueue.removeRepeatable('ReindexLessons', {repeat: {cron: '0 0 * * *'}});
  triggerQueue.add('ReindexLessons', {data: 'Reindex Lessons Once a Day'}, {repeat: {cron: '0 0 * * *'}});

  triggerQueue.process('ReindexSentences', 1, async function (job) {
    await sails.helpers.search.reindexSentences();
  });
  triggerQueue.removeRepeatable('ReindexSentences', {repeat: {cron: '0 1 * * *'}});
  triggerQueue.add('ReindexSentences', {data: 'Reindex Lessons Once a Day'}, {repeat: {cron: '0 1 * * *'}});
}
