/**
 * arena hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineArenaHook(sails) {

  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function(done) {

      // Otherwise, create a compiler so that we can watch files.
      sails.after('hook:http:loaded', function () {

        if (process.env.NODE_ENV === 'development') { // Ignore for Dev

        } else {

          sails.log.info('Initializing custom hook (`arena`)');

          const expressApp = sails.hooks.http.app;

          const Arena = require('bull-arena');

          const arenaConfig = Arena({
              queues: [
                {
                  "name": "UserInfoQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                },
                {
                  "name": "CleanupQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                },
                {
                  "name": "TriggerQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                },
                {
                  "name": "LoggingQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                },
                {
                  "name": "EmailTriggerQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                },
                {
                  "name": "PaymentEmailQueue",
                  "port": 6379,
                  "host": "cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com",
                  "hostId": "CPODRedis",
                  "db": 8
                }
              ],
            },
            {
              // Make the arena dashboard become available at {my-site.com}/arena-job-queue.
              basePath: '',

              // Let express handle the listening.
              disableListen: true
            });

          expressApp.get('/arena-job-queue', function (req, res, next) {

            sails.log.info({req: req.session, joint: !req.session || !req.session.userId || !req.session.userId === 1016995, sessionExists: req.session, isUgis: req.session.userId === 1016995, id: req.session.userId});

            if (!req.session || !req.session.userId ) {
              return res.redirect('/login');
            }//•
            // Then check that this user is a "super admin".
            if (!req.session || !req.session.userId || !req.session.userId === 1016995) {  // Hardcode for personal access
              return res.status(403).send('Forbidden')
            }//•
            // IWMIH, we've got ourselves a "super admin".
            return next();
          });
          expressApp.use('/arena-job-queue', arenaConfig);
        }

      });

      // Continue lifting Sails.
      return done();

    }

  };

};
