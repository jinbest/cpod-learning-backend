/*
 * Copyright (c) 2020. Ugis Rozkalns
 */

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

    let currentDate = new Date();

    let currentYear = currentDate.getFullYear(), currentMonth = currentDate.getMonth(), currentDay = currentDate.getDate();

    // select count(distinct user_id) from transactions where pay_status=2 and DATE(DATE_ADD(date_created,INTERVAL product_length MONTH))>='2018-02-01'
    // and date_created BETWEEN '2017-02-01 00:00:00' AND '2018-02-28 23:59:59' AND user_id NOT IN
    // (select user_id from transactions where pay_status=2 and DATE(DATE_ADD(date_created,INTERVAL product_length MONTH))>='2018-03-01'
    // and date_created BETWEEN '2017-03-01 00:00:00' AND '2018-03-31 23:59:59');

    let sql = `
    select distinct user_id
    FROM transactions
    WHERE pay_status=2 AND DATE(DATE_ADD(date_created,INTERVAL product_length MONTH))>='${new Date(currentYear, currentMonth - 2, 1).toISOString().slice(0,10)}'
    AND date_created BETWEEN '${new Date(currentYear - 1, currentMonth - 2, 1).toISOString().slice(0,10)}' AND '${new Date(currentYear, currentMonth - 1, 1).toISOString().slice(0,10)}'
    AND user_id NOT IN (select user_id from transactions where pay_status=2 and DATE(DATE_ADD(date_created,INTERVAL product_length MONTH))>='${new Date(currentYear, currentMonth - 1, 1).toISOString().slice(0,10)}' 
    AND date_created BETWEEN '${new Date(currentYear - 1, currentMonth - 1, 1).toISOString().slice(0,10)}' AND '${new Date(currentYear, currentMonth, 1).toISOString().slice(0,10)}');
    `;

    sails.log.info(sql);

    let churnedUsers = (await sails.sendNativeQuery(sql))['rows'];

    sails.log.info(churnedUsers.length);

    let userData = await User.find({id: {in: churnedUsers.map(user => user.user_id)}, confirm_status: 1});

    sails.log.info(userData.length);

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
    const username = 'ugis@chinesepod.com';
    const password = 'SN6oP1aeF2l8BY70PbOx';

    const emailOctopus = new eo.EmailOctopus(apiKey, username, password);

    const axios = require('axios');

    const MD5 = require('crypto-js/md5');

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    let total = userData.length;

    let batch = 2;

    let bulkCount = Math.ceil(total / batch);

    sails.log.info(`Records Fetched in ${bulkCount} Batches`);

    let groups = [{name: 'Asia'}, {name: 'Europe'}, {name: 'Americas'}];

    await asyncForEach(groups, async function (target) {
      target.campaignName = `Churned Users - ${target.name} - ${currentDate.toLocaleString('default', { month: 'long' })}`;

      target.campaignInfo = await emailOctopus.lists.find({name: target.campaignName});

      if (!target.campaignInfo) {

        target.campaignInfo = await emailOctopus.lists.create({name: target.campaignName})

      }

      try {

        target.campaignId = target.campaignInfo.id

      } catch (e) {

        sails.log.error(e);

      }

    });

    sails.log.info(groups);

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

            if (asianCountries.includes(geo.country)) {

              listId = groups.filter(target => target.name === 'Asia')[0]['campaignId'];

            } else if (europeanCountries.includes(geo.country) || africanCountries.includes(geo.country)) {

              listId = groups.filter(target => target.name === 'Europe')[0]['campaignId'];

            } else if (americanCountries.includes(geo.country)) {

              listId = groups.filter(target => target.name === 'Americas')[0]['campaignId'];

            }

            if (listId) {

              await setTimeout(async () => {

                try {

                  let userOctopus = '';

                  userOctopus = await axios.get(`https://emailoctopus.com/api/1.5/lists/${listId}/contacts/${MD5(user.email.toLowerCase())}?api_key=${apiKey}`)
                    .then(({data}) => {return data})
                    .catch(err => {});

                  sails.log.info({octopusData: userOctopus});

                  if (!userOctopus || !userOctopus.id) {

                    await axios.post(`https://emailoctopus.com/api/1.5/lists/${listId}/contacts`, {
                      api_key: apiKey,
                      email_address: user.email.toLowerCase(),
                      fields: {
                        FirstName: firstName
                      }
                    });

                    sails.log.info(`Added ${firstName ? firstName + ' ' : ''}${options.email_address}`);

                  } else {

                    if (userOctopus.id && userOctopus.fields && userOctopus.fields.FirstName !== firstName) {

                      await axios.put(`https://emailoctopus.com/api/1.5/lists/${listId}/contacts/${userOctopus.id}`, {
                        api_key: apiKey,
                        fields: {
                          FirstName: firstName
                        }
                      });

                      sails.log.info(`Updated ${firstName ? firstName + ' ' : ''}${options.email_address}`);

                    } else {

                      sails.log.info(`Skipped ${firstName ? firstName + ' ' : ''}${options.email_address}`);

                    }

                  }
                } catch (e) {

                  sails.log.error(e)

                }

              }, i * 2000)

            } else {

              // sails.hooks.bugsnag.notify(`Could not add User ${user.email} to Octopus with Country ${geo.country}`);
              sails.log.info(`Could not add User ${user.email} to Octopus with Country ${geo.country}`);

            }

          }

        }

      });
    }

  }


};

