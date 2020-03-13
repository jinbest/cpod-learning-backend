if (process.env.NODE_ENV !== 'production' || sails.config.environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var triggerQueue = new Queue('TriggerQueue', sails.config.jobs.url);
  triggerQueue.clean(0);

  triggerQueue.process('ReindexLessons', 1, async function () {
    await sails.helpers.search.reindexLessons();
    await sails.helpers.search.reindexCourses();
  });
  triggerQueue.add('ReindexLessons', {data: 'Reindex Lessons Once a Day'}, {repeat: {cron: '0 0 * * *'}});

  triggerQueue.process('ReindexSentences', 1, async function () {
    await sails.helpers.search.reindexSentences();
  });
  triggerQueue.add('ReindexSentences', {data: 'Reindex Lessons Once a Day'}, {repeat: {cron: '0 1 * * *'}});

  triggerQueue.process('NewLessonNotifications', 1, async function () {
    await sails.helpers.notifications.newLesson();
  });
  triggerQueue.add('NewLessonNotifications', {data: 'Check Lessons Every 15 min'}, {repeat: {every: 15 * 60 * 1000}});
}
