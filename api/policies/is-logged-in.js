/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {

  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (req.session.userId) {
    return proceed();
  } else if (req.cookies.CPODSESSID){
    let sid = req.cookies.CPODSESSID;
    sails.log.info(sid);
    let userData = await PhpSessions.findOne({
      where: {id: sid},
      select: ['session_user_id']
    });
    sails.log.info(userData);
    if (userData) {
      sails.log.info(userData);
      try {
        req.session.userId = userData['session_user_id'];
        sails.log.info(userData);
        return proceed();
      } catch (e) {
        sails.log.info(e);
        return res.unauthorized();
      }
    }
  }

  //--•
  // Otherwise, this request did not come from a logged-in user.
  return res.unauthorized();

};
