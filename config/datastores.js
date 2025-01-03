/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {

  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod_production',
  },
  comments: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod_production',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  },
  logging: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod_logging',
  },
  backuplogging: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod_logging',
  },
  assessment: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/assessment',
  },
  chinesepod2015: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod2015',
  },
  mauticDb: {
    adapter: require('sails-mysql'),
    url: 'mysql://cpodadmin:ruXM65mP82PG@chinesepod-mautic.cx6o0r5nidjs.us-east-1.rds.amazonaws.com:3306/bitnami_mautic',
  },
  ams_db: {
    adapter: require('sails-mysql'),
    url: 'mysql://ams_dba:23-0wsv;_jvxkvjl3w;sldkfdad=-@proddb02.chinesepod.com:3306/cpodams_ams2',
  }
};
