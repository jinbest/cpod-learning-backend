module.exports = {


  friendlyName: 'Process inactive',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let testUsers = ["ugis@chinesepod.com"];

    let emailList = (await EmailLogs.find().select('user_id')).map(item => item.user_id);

    let userData = await sails.models['user'].find({email: {in: liveUsers}, id: {nin: emailList}});
    // let userData = await sails.models['user'].find({email: {in: testUsers}});

    sails.log.info(`Clean List - ${userData.length}`);

    let asianCountries = ["YE", "IQ", "SA", "IR", "SY", "AM", "JO", "LB", "KW", "OM", "QA", "BH", "AE", "IL", "TR",
      "AZ", "GE", "AF", "PK", "BD", "TM", "TJ", "LK", "BT", "IN", "MV", "IO", "NP", "MM", "UZ", "KZ", "KG", "CC",
      "PW", "VN", "TH", "ID", "LA", "TW", "PH", "MY", "CN", "HK", "BN", "MO", "KH", "KR", "JP", "KP", "SG", "CK",
      "TL", "MN", "AU", "CX", "MH", "FM", "PG", "SB", "TV", "NR", "VU", "NC", "NF", "NZ", "FJ", "PF", "PN", "KI",
      "TK", "TO", "WF", "WS", "NU", "MP", "GU", "UM", "AS", "PS"];

    const europeanCountries = ["CY", "GR", "EE", "LV", "LT", "SJ", "MD", "BY", "FI", "AX", "UA", "MK", "HU", "BG",
      "AL", "PL", "RO", "XK", "RU", "PT", "GI", "ES", "MT", "FO", "DK", "IS", "GB", "CH", "SE", "NL", "AT", "BE",
      "DE", "LU", "IE", "MC", "FR", "AD", "LI", "JE", "IM", "GG", "SK", "CZ", "NO", "VA", "SM", "IT", "SI", "ME",
      "HR", "BA", "RS"];

    const africanCountries = ["RW", "SO", "TZ", "KE", "CD", "DJ", "UG", "CF", "SC", "ET", "ER", "EG", "SD", "BI",
      "ZW", "ZM", "KM", "MW", "LS", "BW", "MU", "SZ", "RE", "ZA", "YT", "MZ", "MG", "LY", "CM", "SN", "CG", "LR",
      "CI", "GH", "GQ", "NG", "BF", "TG", "GW", "MR", "BJ", "GA", "SL", "ST", "GM", "GN", "TD", "NE", "ML", "EH",
      "TN", "MA", "DZ", "AO", "NA", "SH", "CV", "SS"];

    const americanCountries = ["BB", "GY", "GF", "SR", "PM", "GL", "PY", "UY", "BR", "FK", "JM", "DO", "CU", "MQ",
      "BS", "BM", "AI", "TT", "KN", "DM", "AG", "LC", "TC", "AW", "VG", "VC", "MS", "MF", "BL", "GP", "GD", "KY",
      "BZ", "SV", "GT", "HN", "NI", "CR", "VE", "EC", "CO", "PA", "HT", "AR", "CL", "BO", "PE", "MX", "PR", "VI",
      "CA", "US", "SX", "CW", "BQ"];

    const geoip = require('geoip-country');

    const eo = require('email-octopus');
    const apiKey = '1ce2c0f8-a142-11e9-9307-06b4694bee2a';
    // const username = 'ugis@chinesepod.com';
    // const password = 'SN6oP1aeF2l8BY70PbOx';

    const emailOctopus = new eo.EmailOctopus(apiKey);

    const MD5 = require('crypto-js/md5');

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    let total = userData.length;

    let batch = 5;

    let bulkCount = Math.ceil(total / batch);

    sails.log.info(`Records Fetched in ${bulkCount} Batches`);

    for (let i = 0; i < bulkCount; i++) {
      await asyncForEach(userData.slice(i * batch, (i + 1) * batch), async (user) => {

        if (user.ip_address || user.country) {

          let geo = {};

          if (user.ip_address) {

            geo = geoip.lookup(user.ip_address);

          }

          if ((!geo || !geo.country) && user.country) {
            geo = {country: user.country};
          }

          if (geo && geo.country) {

            let listId = '';
            const options = {
              email_address: user.email
            };

            let firstName = await sails.helpers.users.calculateFirstName(user.name);

            if (firstName) {
              options.first_name = firstName;
            }

            // sails.log.info(options);

            if (asianCountries.includes(geo.country)) {

              listId = '9b451d69-431d-11ea-be00-06b4694bee2a'

            } else if (europeanCountries.includes(geo.country) || africanCountries.includes(geo.country)) {

              listId = 'a387ee7f-431d-11ea-be00-06b4694bee2a';

            } else if (americanCountries.includes(geo.country)) {

              listId = 'a991b310-431d-11ea-be00-06b4694bee2a'

            }

            if (listId) {

              await setTimeout(async () => {
                emailOctopus.lists.contacts.get(listId, MD5(user.email.toLowerCase()).toString())
                  .then(function () {
                    sails.log.info('Contact updated')
                  })
                  .catch(function (err) {
                    if (err.statusCode === 404) {
                      emailOctopus.lists.contacts.create(listId, options)
                        .then(function() {
                          sails.log.info('contact added');
                        })
                        .catch(err => {sails.log.error(err.statusCode)})
                    }});
              }, i * 2000)

            } else {

              sails.hooks.bugsnag.notify(`Could not add User ${user.email} to Octopus with Country ${geo.country}`)

            }

          }

        }

      });
    }

  }


};
