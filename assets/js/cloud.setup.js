/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["code"]},"updateOptions":{"verb":"PUT","url":"/api/v1/account/update-options","args":["userId","emailAddress","type","value"]},"emailResults":{"verb":"POST","url":"/api/v1/placement/email-results","args":["emailAddress","results"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","optIn"]},"pricing":{"verb":"PUT","url":"/api/v1/onboarding/pricing","args":["plan"]},"level":{"verb":"PUT","url":"/api/v1/onboarding/level","args":["level","charSet"]},"request":{"verb":"GET","url":"/api/v1/request","args":[]},"getPopularLessons":{"verb":"GET","url":"/api/v1/get-popular-lessons","args":[]},"ipInfo":{"verb":"GET","url":"/api/v1/ip-info","args":["ipAddress"]},"generateWords":{"verb":"GET","url":"/api/v1/generate-words","args":["complexity","pattern"]},"swagger":{"verb":"GET","url":"/swagger"},"swaggerjson":{"verb":"GET","url":"/swagger.json"}}
  /* eslint-enable */

});
