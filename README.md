# ChinesePod JS Stack

a [Sails v1](https://sailsjs.com) application connecting to the existing AWS RDS DB


### Links

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Fri Jun 21 2019 12:13:43 GMT+0800 (Hong Kong Standard Time) using Sails v1.2.2.

### Deployment

####Development localhost version

`sails lift`

####Staging version on https://staging.chinesepod.com

`NODE_ENV=production sails_environment=staging pm2 start app.js -i 0`

To stop

`pm2 stop all`

####Production version on https://staging.chinesepod.com

To launch

`pm2 start app.js -i 0 -- --prod`

To reload (this allows a graceful startup of each app (per processor) to avoid 502 errors)

`pm2 reload all --wait-ready --listen-timeout 15000`


## TODOs:
### Stripe
- [ ] Stripe Integration
- [ ] Stripe Load Screen
- [x] Stripe Error Handling
- [ ] Promo Codes
- [ ] Customer ID Storage
- [ ] Subscription Storage
- [ ] Transaction Storage


###Onboarding
- [ ] Migrate Terms Acceptance

###Routing
- [ ] Handle Purchasing Routing and possible errors

###Misc
- [ ] Implement Human-readable API output page for `/recap/get-user-lesson`
