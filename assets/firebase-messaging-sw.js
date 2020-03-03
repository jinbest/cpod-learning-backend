/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */
importScripts('https://www.gstatic.com/firebasejs/7.9.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.2/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': '776300932499'
});
const messaging = firebase.messaging();
