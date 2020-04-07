if (process.env.NODE_ENV !== 'production' || sails.config.environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var triggerQueue = new Queue('TriggerQueue', sails.config.jobs.url);
  triggerQueue.clean(0);
  triggerQueue.clean(0, 'delayed');
  triggerQueue.clean(0, 'failed');

  triggerQueue.process('ReindexLessons', 1, async function () {
    await sails.helpers.search.reindexLessons();
    await sails.helpers.search.reindexCourses();
  });

  triggerQueue.process('ReindexSentences', 1, async function () {
    await sails.helpers.search.reindexSentences();
  });

  triggerQueue.process('NewLessonNotifications', 1, async function () {
    await sails.helpers.notifications.newLesson();
  });

  triggerQueue.process('UpdateUserCurrentLessons', 1, async  function () {
    await sails.helpers.users.checkCurrentLessons();
  });

  triggerQueue.add('NewLessonNotifications', {data: 'Check Lessons Every 15 min'}, {repeat: {every: 15 * 60 * 1000}});

  triggerQueue.add('UpdateUserCurrentLessons', {data: 'Check Lessons Every 10 min'}, {repeat: {every: 10 * 60 * 1000}});

}
