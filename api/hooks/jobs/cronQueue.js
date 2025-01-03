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

  triggerQueue.process('ReindexChanges', 1, async function () {
    await sails.helpers.search.reindexChangedLessons();
    await sails.helpers.search.reindexChangedCourses();
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

  triggerQueue.process('Cleanup', 1, async function () {
    await RefreshTokens.destroy({expiry: {'<': new Date()}});
    await LinkDevice.destroy({updatedAt: {'<': new Date(Date.now() - 1000*60*60*24)}});
    await NySession.destroy({updatedAt: {'<': new Date(Date.now() - 1000*60*60*24*60)}});
  })

  triggerQueue.add('NewLessonNotifications', {data: 'Check Lessons Every 15 min'}, {repeat: {every: 15 * 60 * 1000}});

  triggerQueue.add('UpdateUserCurrentLessons', {data: 'Check Lessons Every 180 min'}, {repeat: {every: 60 * 60 * 1000}});

  triggerQueue.add('ReindexChanges', {data: 'Check for lesson or Course Changes Every Hour'},{repeat: {every: 1000 * 60 * 60}});

  triggerQueue.add('Cleanup', {}, {repeat: {every: 1000 * 60 * 60}});

}
