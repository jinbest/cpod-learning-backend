/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /**************************************************************************
  *                                                                         *
  * The base URL to use during development.                                 *
  *                                                                         *
  * • No trailing slash at the end                                          *
  * • `http://` or `https://` at the beginning.                             *
  *                                                                         *
  * > This is for use in custom logic that builds URLs.                     *
  * > It is particularly handy for building dynamic links in emails,        *
  * > but it can also be used for user-uploaded images, webhooks, etc.      *
  *                                                                         *
  **************************************************************************/
  baseUrl: 'http://localhost:1337',

  /**************************************************************************
  *                                                                         *
  * The TTL (time-to-live) for various sorts of tokens before they expire.  *
  *                                                                         *
  **************************************************************************/
  passwordResetTokenTTL: 24*60*60*1000,// 24 hours
  emailProofTokenTTL:    24*60*60*1000,// 24 hours

  /**************************************************************************
  *                                                                         *
  * The extended length that browsers should retain the session cookie      *
  * if "Remember Me" was checked while logging in.                          *
  *                                                                         *
  **************************************************************************/
  rememberMeCookieMaxAge: 30*24*60*60*1000, // 30 days

  /**************************************************************************
  *                                                                         *
  * Automated email configuration                                           *
  *                                                                         *
  * Sandbox Mailgun credentials for use during development, as well as any  *
  * other default settings related to "how" and "where" automated emails    *
  * are sent.                                                               *
  *                                                                         *
  * (https://app.mailgun.com/app/domains)                                   *
  *                                                                         *
  **************************************************************************/
  mailgunDomain: 'mailg.chinesepod.com',
  mailgunSecret: 'afe8013d8cfd50887526da8bdbcc6c21-29b7488f-4470acc8',


  emailOctopusSecret: '1ce2c0f8-a142-11e9-9307-06b4694bee2a',
  //--------------------------------------------------------------------------
  // /\  Configure these to enable support for automated emails.
  // ||  (Important for password recovery, verification, contact form, etc.)
  //--------------------------------------------------------------------------

  // The sender that all outgoing emails will appear to come from.
  fromEmailAddress: 'team@chinesepod.com',
  fromName: 'The ChinesePod Team',

  // Email address for receiving support messages & other correspondences.
  // > If you're using the default privacy policy, this will be referenced
  // > as the contact email of your "data protection officer" for the purpose
  // > of compliance with regulations such as GDPR.
  internalEmailAddress: 'support@chinesepod.com',

  // Whether to require proof of email address ownership any time a new user
  // signs up, or when an existing user attempts to change their email address.
  verifyEmailAddresses: true,

  /**************************************************************************
  *                                                                         *
  * Billing & payments configuration                                        *
  *                                                                         *
  * (https://dashboard.stripe.com/account/apikeys)                          *
  *                                                                         *
  **************************************************************************/
  stripePublishableKey: 'pk_test_4VxncInS2mI0bVeyKWPOGSMY',
  stripeSecret: 'sk_test_hDZHzh7nC3vW9IgXsAGAtyKN',

  //PAYPAL
  paypalAccount: 'sb-f3top532686@business.example.com',
  paypalPublishableKey: 'AZGCQyxdYVNlEao8bzD7tMrccqocSl4hjZmhR6nZ8bL7rCewPXRywjP-uwolycnyIodbL5oQvN8dixZE',
  paypalSecret: 'ECwA9M9Bc4osxlGadeDSSGCgoS8t9wKAeyHOzq1Up6EUb4jKtUTuJxqX9RxonKD6hALICz83jb61SssA',
  //--------------------------------------------------------------------------
  // /\  Configure these to enable support for billing features.
  // ||  (Or if you don't need billing, feel free to remove them.)
  //--------------------------------------------------------------------------

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // AWS S3 Buckets

  awsKey: 'AKIA4DQYSAHG3CJYO4XH',
  awsSecret: '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',

  downloadBase: 'https://s3.amazonaws.com/chinesepod.com',

  // IP Data Key
  ipDataKey: '67ce141658c735941e1307cf08fcf9a40cd5101a64f19ea674688fff',


  // JWT Secret
  jwtSecret: 'e24qwkdj6wm7inne45fau5my7zuk2q8l3w5xn7ct',


  // ADVERTISING PROMOS
  // coreMarkets: ['US', 'CA', 'CN'],
  coreMarkets: ['US', 'CA', 'UK', 'IE'],
  coreFreeMonths: [0,2,4,6,8,10],
  nonCoreFreeMonths: [1,2,3,5,7,9,11],
  prerollAdId: ['p5yrv7huyo', 'sa5v4h9bm7'],
  upgradeLink: '/upgrade/aprilfools',
  // coreFreeMonths: [],
  // nonCoreFreeMonths: [],
  overrideWindow: false  // TODO add a time window constraint as needed
};
