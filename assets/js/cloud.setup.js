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
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["code"]},"update":{"verb":"POST","url":"/api/v1/webhooks/mautic/update","args":["trigger","email"]},"updateOptions":{"verb":"PUT","url":"/api/v1/account/update-options","args":["userId","emailAddress","type","value"]},"emailResults":{"verb":"POST","url":"/api/v1/placement/email-results","args":["emailAddress","results"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","optIn","level","charSet"]},"login":{"verb":"POST","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"pricing":{"verb":"PUT","url":"/api/v1/onboarding/pricing","args":["plan"]},"level":{"verb":"PUT","url":"/api/v1/onboarding/level","args":["level","charSet"]},"checkout":{"verb":"PUT","url":"/api/v1/purchase/checkout","args":["plan","billingCycle","emailAddress","userId","fName","lName","zip","token","trial"]},"checkPromo":{"verb":"POST","url":"/api/v1/purchase/check-promo","args":["promoCode","plan","billingCycle"]},"checkEmail":{"verb":"POST","url":"/api/v1/purchase/check-email","args":[]},"request":{"verb":"GET","url":"/api/v1/request","args":[]},"time":{"verb":"GET","url":"/api/v1/health/time","args":[]},"getPopularLessons":{"verb":"GET","url":"/api/v1/get-popular-lessons","args":["days"]},"getUserLesson":{"verb":"POST","url":"/api/v1/recap/get-lessons","args":["sessionId"]},"requestLesson":{"verb":"POST","url":"/api/v1/recap/request-lesson","args":["emailAddress","lessonId","sessionId"]},"ipInfo":{"verb":"GET","url":"/api/v1/health/ip-info","args":["ipAddress"]},"generateWords":{"verb":"GET","url":"/api/v1/health/generate-words","args":["complexity","pattern"]},"swagger":{"verb":"GET","url":"/swagger"},"swaggerjson":{"verb":"GET","url":"/swagger.json"}}
  /* eslint-enable */

});
