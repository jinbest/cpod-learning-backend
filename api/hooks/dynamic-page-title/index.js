/**
 * dynamic-page-title hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineDynamicPageTitleHook(sails) {

  return {
    routes: {
      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        '/*': {
          skipAssets: true,
          fn: async function(req, res, next){
            // add page title variable to each response
            if (req.method === 'GET') {
              if (res.locals.title === undefined) {
                res.locals.title = 'Start Learning Mandarin Chinese Today! | ChinesePod';
              }
            }
            return next();
          }
        }
      }
    }
  };

};
