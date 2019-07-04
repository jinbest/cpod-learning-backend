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
  methods: {"updateOptions":{"verb":"PUT","url":"/api/v1/account/update-options","args":["userId","type","value"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","optIn"]},"request":{"verb":"GET","url":"/api/v1/request","args":[]},"ipInfo":{"verb":"POST","url":"/api/v1/ip-info","args":["ipAddress"]},"generateWords":{"verb":"GET","url":"/api/v1/generate-words","args":["complexity","pattern"]}}
  /* eslint-enable */

});
