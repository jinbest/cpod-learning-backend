/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts(
  "/dash/precache-manifest.0321a087ca9fe2733444d61a594356ec.js"
);

workbox.core.setCacheNameDetails({prefix: "chinesepod-dashboard"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:jpg|jpeg|svg|gif|png)/, workbox.strategies.cacheFirst({ "cacheName":"images", plugins: [new workbox.cacheableResponse.Plugin({"statuses":[0,200]}), new workbox.expiration.Plugin({"maxEntries":120,"maxAgeSeconds":2592000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/chinesepod.com\/images\//, workbox.strategies.cacheFirst({ "cacheName":"images", plugins: [new workbox.cacheableResponse.Plugin({"statuses":[0,200]}), new workbox.expiration.Plugin({"maxEntries":120,"maxAgeSeconds":2592000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/www.chinesepod.com\/images\//, workbox.strategies.cacheFirst({ "cacheName":"images", plugins: [new workbox.cacheableResponse.Plugin({"statuses":[0,200]}), new workbox.expiration.Plugin({"maxEntries":120,"maxAgeSeconds":2592000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/www.chinesepod.com\/api\/dashboard\//, workbox.strategies.staleWhileRevalidate({ "cacheName":"api-course-cache", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/www.chinesepod.com\/api\//, workbox.strategies.networkFirst({ "cacheName":"api-cache","networkTimeoutSeconds":1, plugins: [] }), 'GET');
