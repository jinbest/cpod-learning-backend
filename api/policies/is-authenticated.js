const testingTokens = ['aaaa1111bbbb2222cccc3333'];

module.exports = function(req, res, proceed) {
  var token;
  //Check if authorization header is present
  if(req.headers && req.headers.authorization) {
    //authorization header is present
    var parts = req.headers.authorization.split(' ');
    if(parts.length == 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if(/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.status(401).json({err: 'Format is Authorization: Bearer [token]'});
    }
  } else {
    //authorization header is not present
    return res.status(401).json({err: 'No Authorization header was found'});
  }
  if (req.session.expires && new Date() > new Date(req.session.expires)) {
    return res.status(401).json({err: 'Session expired'});
  }
  jwToken.verify(token, function(err, decoded) {
    if(err) {
      if (sails.config.environment === 'staging' && testingTokens.includes(token)) {

        req.session.userId = 1043693;

        return proceed();
      }
      return res.status(401).json({err: 'Invalid token'});
    }

    //TODO revise this
    if (decoded.data.userId) {

      req.session.userId = decoded.data.userId;

    } else if (Number.isInteger(parseInt(decoded.data))) {

      req.session.userId = parseInt(decoded.data)

    } else {

      sails.hooks.bugsnag.notify(`Missing UserId - ${JSON.stringify(decoded)} - ${JSON.stringify(req.session)}`)

    }

    return proceed();
  });
};
