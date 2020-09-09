/**
 * unauthorized.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • log out the current user and redirect them to the login page
 *  • or send back 401 (Unauthorized) with no response body.
 *
 * Example usage:
 * ```
 *     return res.unauthorized();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badCombo: {
 *         description: 'That email address and password combination is not recognized.',
 *         responseType: 'unauthorized'
 *       }
 *     }
 * ```
 */

module.exports = function notFound() {
  var req = this.req;
  var res = this.res;

  if(!req.path.match(sails.LOOKS_LIKE_ASSET_RX) && sails.config.environment === 'production') {


    try {
      loggingQueue.add('LoggingNotFound', {
        user_id: req.session && req.session.userId ? req.session.userId : undefined,
        url: req.url,
        ip_address: req.ip,
        referrer: req.headers['referrer'],
        user_agent: req.headers['user-agent'],
        created_at: new Date()
      }, {
        attempts: 2,
        timeout: 20000,
        removeOnComplete: true
      })
    } catch (e) {}

  }

  return res.redirect(302, `https://chinesepod.com${req.url}`);

};
