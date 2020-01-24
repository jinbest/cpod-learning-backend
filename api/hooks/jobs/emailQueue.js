if (process.env.NODE_ENV !== 'production' || process.env.sails_environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var paymentEmailQueue = new Queue('PaymentEmailQueue', sails.config.jobs.url);

  var userEmailQueue = new Queue('UserEmailQueue', sails.config.jobs.url);

  var emailTriggerQueue = new Queue('EmailTriggerQueue', sails.config.jobs.url);

  emailTriggerQueue.process('SendEmails', 100, async function (job) {
    // Send Failed Payment Email

    let failedPayments = await TransactionsLog.find({
      where: {
        type: 'S_ERROR',
        serialize: {
          '!=': 's:49:"Error Occured while retrieving Stripe Customer ID";'
        },
        createdAt: {
          '>=': new Date(Date.now() - 4 * 60 * 60 * 1000 - 15 * 60 * 1000),
          '<': new Date(Date.now() - 4 * 60 * 60 * 1000),
        }
      }
    });

    failedPayments.forEach(function (payment) {
      if (payment.user_id && payment.user_id !== 0) {
        paymentEmailQueue.add('SendEmail', {
            payment
          },
          {
            attempts: 2,
            timeout: 120000
          })
      }
    });
  });

  paymentEmailQueue.process('SendEmail', 100, async function (job, done) {

    sails.log.info({job: job.data});

    let userData = await User.findOne({id: job.data.payment.user_id});

    let description = '';
    try {
      description = job.data.payment.response.split('"')[1];
    } catch (e) {
      sails.hooks.bugsnag.notify(e)
    }

    let message = `ChinesePod Team,\n\nA user payment has failed. Additional information below:\nUser: ${userData.name}\nCRM: https://www2.chinesepod.com/marketingcenter/users/index/view?user_id=${userData.id}\nEmail: ${userData.email}\nDescription: ${description}\n\nSincerely,\nThe Reporting System`;

    let Mailgun = require('machinepack-mailgun');

    Mailgun.sendPlaintextEmail({

      apiKey: sails.config.custom.mailgunSecret,

      domain: sails.config.custom.mailgunDomain,

      toEmail: 'followup@chinesepod.com',

      toName: 'ChinesePod Followup Team',

      subject: 'Stripe New Subscription Payment Error!',

      message: message,

      fromEmail: 'stripe@chinesepod.com',

      fromName: 'ChinesePod Stripe',

    }).exec({

// An unexpected error occurred.

      error: function (err) {
        sails.hooks.bugsnag.notify(err);
      },

// OK.

      success: function () {

      },
    });

    done();
  });

  userEmailQueue.process('SendEmail', 10, async function (job, done) {
    sails.log.info({job: job.data});

    if (job.data.emailType && job.data.emailType === 'email-alice-inactive-user-asia') {

      let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);

      const path = require('path');
      const url = require('url');
      const util = require('util');

      const layout = false;

      // Determine appropriate email layout and template to use.
      const emailTemplatePath = path.join('emails/', 'automated/email-alice-inactive-user-asia');

      // Compile HTML template.
      // > Note that we set the layout, provide access to core `url` package (for
      // > building links and image srcs, etc.), and also provide access to core
      // > `util` package (for dumping debug data in internal emails).
      const htmlEmailContents = await sails.renderView(
        emailTemplatePath,
        _.extend({layout, url, util }, {greeting: greeting})
      )
        .intercept((err)=>{
          err.message =
            'Could not compile view template.\n'+
            '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
            'Details:\n'+
            err.message;
          done(err);
        });

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: job.data.email,
        subject: `Haven't Seen You in a While`,
        from: 'alice@chinesepod.com',
        fromName: 'Alice Shih'
      })
        .catch(err => done(err));

      await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});

    }
    if (job.data.emailType && job.data.emailType === 'email-susie-inactive-user-europe') {

      let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);

      const path = require('path');
      const url = require('url');
      const util = require('util');

      const layout = false;

      // Determine appropriate email layout and template to use.
      const emailTemplatePath = path.join('emails/', 'automated/email-susie-inactive-user-europe');

      // Compile HTML template.
      // > Note that we set the layout, provide access to core `url` package (for
      // > building links and image srcs, etc.), and also provide access to core
      // > `util` package (for dumping debug data in internal emails).
      const htmlEmailContents = await sails.renderView(
        emailTemplatePath,
        _.extend({layout, url, util }, {greeting: greeting})
      )
        .intercept((err)=>{
          err.message =
            'Could not compile view template.\n'+
            '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
            'Details:\n'+
            err.message;
          done(err);
        });

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: job.data.email,
        subject: `Haven't Seen You in a While`,
        from: 'susie@chinesepod.com',
        fromName: 'Susie Lei'
      })
        .catch(err => done(err));

      await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});

    }

    done()

  });

  emailTriggerQueue.process('ScheduleInactivityEmails', 1, async function (job, done) {

    let users = ['ugis@chinesepod.com'];

    let userData = await sails.models['user'].find({email: {in: users}});

    userData.forEach(user => {


    })

  });

  emailTriggerQueue.process('ScheduleInactivityEmailsProduction', 1, async function (job, done) {

    sails.hooks.bugsnag.notify('Sending Mass Emails');

    let users = ['ugis@chinesepod.com', 'ugis+android@chinesepod.com'];

    // let liveUsers = ["13laorn1@gmail.com", "16ua0386@kufs.ac.jp", "18135@bc.net.nz", "19wihmana@asij.ac.jp", "429576267@qq.com", "4jeffg@gmail.com", "664886@soas.ac.uk", "695868981@qq.com", "A13252124040@gmail.com", "Adampyrke@gmail.com", "Andrew.Hillman@britishcouncil.org.cn", "Annebingham123@hotmail.com", "Bec.banff@gmail.com", "Block_Obs@web.de", "Buckrogers6@gmail.com", "Chanzlue@hotmail.com", "Christian.Bendele@gmx.net", "Dianoetikos@icloud.com", "Dphma@comcast.net", "Gemeddy@hotmail.de", "Herbal7ea@gmail.com", "KazimYildizhan@gmx.de", "Laserragiacomo1@gmail.com", "Luscombe868@hotmail.com", "Mandarin2014b@gmail.com", "Michaela81888@gmail.com", "Mor37rgr38@gmail.com", "NemravaJ52@gmail.com", "Poolman2000@gmail.com", "Seapines17@gmail.com", "Sisley.Mark@gmail.com", "Studentbps1026@gmail.com", "Thom.Stiegler@gmail.com", "TomAdolph@web.de", "Vandammaurane@gmail.com", "Yudithvs99@gmail.com", "Zita_simoes@hotmail.com", "a.ginevich@alvils.ru", "a.nerwinska@gmail.com", "a.papargyriou@gmail.com", "a.s.yang@gmail.com", "a.safiullin@gmail.com", "a4pro@inbox.ru", "aa.almuhairy@gmail.com", "aaronjacobdana@gmail.com", "abdelshakour@gmail.com", "abdulsalamkhanucic@gmail.com", "acfmoura99@gmail.com", "ada2145@columbia.edu", "adam.skubel@gmail.com", "adam.woodward@hotmail.co.uk", "adamjsobieski@icloud.com", "adamluker@outlook.com", "adampyrke@gmail.com", "adfstar@gmail.com", "adi_wu@live.com", "afomiab2655@5565.ca", "agnesbv@wanadoo.fr", "agnescorivuka@gmail.com", "ahed-chalar@hotmail.com", "ahlammalha73@gmail.com", "aidencuthill0@gmail.com", "aieonl-facebook@yahoo.com", "aimeyer315@gmail.com", "aironthe1man@live.com", "ajddavies@hotmail.com", "akandeolalekan620@gmail.com", "akara15@freeuni.edu.ge", "akwestfla@hotmail.com", "alastair.judson@gmail.com", "albert.a.giegerich@gmail.com", "aldiyarovnurcn7@gmail.com", "alessandraiaquinta21@gmail.com", "alex.besogonov@gmail.com", "alex.kopans@gmail.com", "alexander.beard@hotmail.com", "alexandraruth19@gmail.com", "alexei.poliakoff@gmail.com", "alexey@gmail.com", "alexeymakuha@gmail.com", "alexgeers1@gmail.com", "alexiamanea62@gmail.com", "alexterman@gmail.com", "alexycyap@hotmail.com", "alicekatiejohnson@hotmail.co.uk", "alicja.wesierska@gmail.com", "alinakulak2008@mail.ru", "alise357@hotmail.com", "aliy63082@gmail.com", "allan.chung@outlook.com", "alleycat84@gmail.com", "amanats2012@gmail.com", "ameade@uclacademy.org", "amiguelvasallo@gmail.com", "amira24067@yahoo.com", "amirh7@gmail.com", "amitgilboa@offtherails.com", "amnadafalla@gmail.com", "amybritto8@gmail.com", "anajerez12310@gmail.com", "anakaline_br@yahoo.com.br", "anastasiagoryaynova@gmail.com", "anastasiyasaneeva@yandex.ru", "anathan668@yahoo.com", "ancastal@libero.it", "and_e_r@yahoo.com", "anderslundholm@gmail.com", "andersonpappi@msn.com", "andreas.rasner@metis-legal.de", "andrew.admas1989@gmail.com", "andrew.hillman@britishcouncil.org.cn", "andrew.stromme@gmail.com", "andrewclark44@hotmail.com", "android@chinesepod.com", "andru_pet@lenta.ru", "andywillmott@andywillmott.com", "aneeqairfan1@gmail.com", "angela.patterson@ldichina.com", "anhchuotle@yahoo.com", "aniruddh.ravi@gmail.com", "anje.scarfe@y7mail.com", "ann.veeck@wmich.edu", "anna.vyazovska@gmail.com", "anna_ling@mail.ru", "annelie2211@gmail.com", "annemieke.van.den.dool@dukekunshan.edu.cn", "annmary@gmail.com", "antonio.cgdv@gmail.com", "antoniorodrigueslight@gmail.com", "antti.sahikoski@gmail.com", "anu42874@gmail.com", "aolieya@gmail.com", "apetina@gmail.com", "archnor@gmail.com", "arcussen@gmail.com", "ardiinania@gmail.com", "arjunr@gmail.com", "arshad6113@gmail.com", "artisanvin@gmail.com", "arul8788@gmail.com", "as_amrouche@esi.dz", "asier@dna1964.com", "asstumpf@posteo.de", "astrid.muckli@kino-ist-das-groesste.de", "asyang79@mac.com", "asyayulchi@gmail.com", "attila.patak@accountantz.hu", "audrey.nonemaker@gmail.com", "augusteklim21@gmail.com", "augusthill@protonmail.com", "aura.pamintuan@gmail.com", "autumnlandau@gmail.com", "awgaither@crimson.ua.edu", "awp45@cornell.edu", "aynsleylachlan@gmail.com", "ayoleynikov@icloud.com", "azmatbadshah0@gmail.com", "babocsdora@gmail.com", "bagdad.78@gmail.com", "bajuszzitus@gmail.com", "bambookataki@gmail.com", "bankforeverfriend@gmail.com", "barbieangelio7@gmail.com", "bart@siluur.nl", "barteknieb@gmail.com", "baumer.konstantin@gmail.com", "bayuindriyanto8@gmail.com", "bccall@gmail.com", "beatricenghiem211@gmail.com", "beatrix.francoise@orange.fr", "bec.banff@gmail.com", "bechaydamechelle29@gmail.com", "becky.gardiner93@outlook.com", "bednenko.yuliya@mail.ru", "berettadahl@gmail.com", "berkanosowelu@gmail.com", "bestkakashka@gmail.com", "betoperetti@gmail.com", "bias.daewhi@gmail.com", "bisho_o1419@hotmail.com", "bixnca.hart@gmail.com", "bljedwards@gmail.com", "bminshaw@gmail.com", "bo.sorensen.uk@gmail.com", "bob.erdman@gmail.com", "bobcash700@gmail.com", "bosstre81@gmail.com", "brahma7898@gmail.com", "brandonleeviet@outlook.com", "bravedragon632@gmail.com", "brendancorney@gmail.com", "brianhagertymd@gmail.com", "brookestasch@hotmail.com", "bruno.eng@hotmail.com", "bryan@nagorcka.family", "bryanjohnsmittysmith@gmail.com", "btgreen0809@gmail.com", "bthuong2003@gmail.com", "buero@coverspot.com", "butterflyjoy88@gmail.com", "butukhanov@bk.ru", "byerlyphoto@aol.com", "bythepenguin@gmail.com", "c.hermawan.vic@gmail.com", "c.samnang@icloud.com", "c5cort@hotmail.com", "cabrerachristian011@gmail.com", "caitharris@comcast.net", "calebcampbell7@gmail.com", "camille.akoun@sciencespo.fr", "camthefencerman@gmail.com", "candice.puga@gmail.com", "capboulet@gmail.com", "carboni.giannantonio@gmail.com", "carcarosone1@gmail.com", "carlyka@icloud.com", "carlyle-dlgy@outlook.fr", "carolynannevans@gmail.com", "cash.m12@gmail.com", "casio384@ya.ru", "cass.travis004@gmail.com", "casualnomad@hotmail.com", "catherine.spencer@aus.salvationarmy.org", "cauds1@hotmail.com", "cbmann01@gmail.com", "cbro80@gmail.com", "cchern@yahoo.com", "ccliffharris@gmail.com", "cdonegan@donboscoprep.org", "cedparadis99@gmail.com", "cedricmorinoros@outlook.fr", "ceesaymaimuna60@gmail.com", "celectialaeon@gmail.com", "cforrestcollins@gmail.com", "ch.haddane@gmail.com", "ch.t.volk@gmail.com", "chabsbox@gmail.com", "chaddus@gmail.com", "chanzlue@hotmail.com", "charles.f.vitry@gmail.com", "charlesq.wu@gmail.com", "charlottearden@y7mail.com", "charpong@sbcglobal.net", "chatdemere@yahoo.com.tw", "cheeordie1@gmail.com", "cherylvutran@gmail.com", "chetsahak@gmali.com", "chichimarimarikuri@gmail.com", "china@teatracks.com", "chinedepoddy@ranne.de", "chinesepod.espe2@gmail.com", "chinesepod@badpint.org", "chip.designer@gmail.com", "chloen0430@student.k12.tulsaschools.org", "cholongkim@gmail.com", "choo.siewmei@gmail.com", "chrisartmission11@gmail.com", "chrisdelyer@gmail.com", "chrislerner@gmail.com", "christian.strauch1@gmail.com", "christinexie07@gmail.com", "chrs.hrpr@gmail.com", "chua.jezelle@gmail.com", "chunsinglau@gmail.com", "cifi@gmx.net", "cihatbasol@gmail.com", "ck_patton@hotmail.com", "classicalvideo@gmail.com", "claudialx3@gmail.com", "claudinev@scallen.me.uk", "claudio_ferrario@hotmail.com", "claysorem@icloud.com", "clemagnan@gmail.com", "clkraus@eagle.fgcu.edu", "cloudivia@gmail.com", "clspanbauer@gmail.com", "cmwild82@gmail.com", "colconroy@mac.com", "colton.crivelli@gmail.com", "conor_maguire@hotmail.co.uk", "contactsudarshansharma@gmail.com", "cpod@futureresearch.com", "craig.alec.davies@gmail.com", "crewcut.fog@mail.ru", "crockdc@gmail.com", "croyse7564@gmail.com", "crystalchuhy@gmail.com", "ctchan@gmail.com", "cuthanh737@gmail.com", "cynthia.lu19@gmail.com", "cython@hotmail.com", "dailyhangover@icloud.com", "dalalay.03@gmail.com", "dale.jjames@hotmail.com", "dallaspiller@gmail.com", "damcgrath1@gmail.com", "danejersey@gmail.com", "danielkurdi0@gmail.com", "danielmang@gmail.com", "dannn.bell@gmail.com", "darciekenway@email.com", "daschenalyt@gmail.com", "daveynj113@gmail.com", "david.lee@shaw.ca", "david@davidbwilson.com", "davidecurro@gmail.com", "davidfrancis57@yahoo.co.uk", "davidintoronto2004@hotmail.com", "dcschnerr@yahoo.com", "dd0648223@gmail.com", "ddebilloez@telenet.be", "ddolega@gmail.com", "dduhayon@gmail.com", "de-joveu@hotmail.com", "deboramariareman42@gmail.com", "deilight@gmail.com", "delacruzjason045@gmail.com", "denis.vasilev@yahoo.com", "dennis2551@aol.com", "dermotamcgrath@gmail.com", "dermydevine@yahoo.com", "desmondchng.work@gmail.com", "devman_br@yahoo.com.au", "dewei001@gmail.com", "dick.clements@gmail.com", "didikoch@uw.edu", "dillroy@hotmail.com", "dinhluongthanhdat@gmail.com", "dinokeane@hotmail.com", "djavandeclercq@outlook.com", "djsimmhk@gmail.com", "dkulina@gmx.de", "dleiman@uci.edu", "dmloadm@yahoo.com", "dmuffley@hotmail.com", "dontaviushightower60@gmail.com", "dorothe.st@gmx.de", "douglaskidd@hotmail.com", "doyeongheo@gmail.com", "dp070985loo@gmail.com", "drjko@btinternet.com", "dstillman.2@gmail.com", "dtarkalson@gmail.com", "dterasawa@hotmail.com", "dunkley@gmail.com", "durenjie@aol.com", "dwanderton+chinesepod@gmail.com", "dylanambrose@gmail.com", "e.strihovskaya@gmail.com", "economicsprofessor@yahoo.com", "ed.may1982@gmail.com", "edwinhlee@telus.net", "eelcow@gmail.com", "egdehan@gmail.com", "eibrahim@mountpleasantprimary.co.uk", "eirique@hotmail.com", "elias4149@gmail.com", "elias_schinas@hotmail.com", "emakman@gmail.com", "emilycheung15@gmail.com", "emmaflores1204@gmail.com", "emmakcook15@icloud.com", "emmanuelledalfarra@yahoo.fr", "emmarenshaw@gmail.com", "emsotoes@hotmail.com", "enimece@gmail.com", "enkhmgl.n@gmail.com", "enricogabriel32@gmail.com", "eojera@gmail.com", "erazaira95@gmail.com", "ericabrackman@gmail.com", "ericyolai@gmail.com", "erik@brwr.eu", "ese4ka888@mail.ru", "ettinger@khlaw.com", "etupet@yahoo.com", "evan.chrls@yahoo.com", "evanarnold@mac.com", "ewamaria77@yahoo.com", "ewishnick@gmail.com", "eze91@outlook.com", "f.kiemeneij@gmail.com", "faheyj25@gmail.com", "faisalriyaz.2010@gmail.com", "faustick666@gmail.com", "fayezdiab@live.com", "fb.jaydie@gmail.com", "fernanditofull@gmail.com", "ffbcjr@aol.com", "filipa16neves@hotmail.com", "fireman3787@hotmail.com", "fishmanj93@gmail.com", "florian.klopfleisch@gmail.com", "florianpulch@gmail.com", "folechno@gmail.com", "frabruce@hotmail.co.uk", "francis.young@cie.edu.ph", "frank.joseph@trade.gov", "franky196@hotmail.com", "fred.kong1@gmail.com", "freddycolon@yahoo.com", "furtuna0711@gmail.com", "g.justin.hulog@gmail.com", "gaapie@hetnet.nl", "gabrr030.203@lgflmail.net", "galatian220.semu@gmail.com", "gary.cygiel@gmail.com", "geetabhandari1324@gmail.com", "gehughes94@gmail.com", "gemeddy@hotmail.de", "geparrott2000@gmail.com", "ghanmouni.zineb@gmail.com", "gigilb1510@gmail.com", "gilles.voirin@me.com", "giovannaruiu6@gmail.com", "giuseppe@cervoni.com", "gjexm@hotmail.com", "gkubik@utexas.edu", "glen.coppin@mac.com", "glenntekahu52@gmail.com", "glina-m@mail.ru", "gmforvm@gmail.com", "go-systems@hotmail.com", "gojgo26@gmail.com", "gomez.marc@hotmail.com", "gotnetdudeman313@aol.com", "granelli.suzanne@gmail.com", "granjacatana05@gmail.com", "greenlanee@gmail.com", "greerbw@gmail.com", "greerjo@gmail.com", "gregkschroeder@gmail.com", "gregory3236@yahoo.com", "gsmoodie@wlrk.com", "gujai99@yahoo.com", "gurungramsing@gmail.com", "guyfeng.javelier@gmail.com", "haddad464@hotmail.com", "hagen@isx.de", "haitham_egita@yahoo.com", "haley.hudgens22@yahoo.com", "haminhtamtb@gmail.com", "hamjad2002@gmail.com", "hamyaronline@yahoo.com", "hamza.raja@britishcouncil.org.cn", "hananyaallen@gmail.com", "hanhcaothimy@gmail.com", "hanjunducros@yahoo.fr", "hankanolosha@gmail.com", "hankliao@gmail.com", "hannahmurphy139@gmail.com", "hansuvarov@list.ru", "happyenda@gmail.com", "harmony.boulet@protonmail.com", "harriprasad@aol.co.uk", "harrovian24@yahoo.co.uk", "harshad@northwestern.edu", "hartmrolf@googlemail.com", "haukitman@gmail.com", "hawbaker.darla@gmail.com", "hbryson14@outlook.com", "hdahn@live.com", "hdang013@gmail.com", "heatherclydesdale@gmail.com", "heematt2000@gmail.com", "heidigorny@gmail.com", "heiko_daniels@gmx.de", "hello@collinsparker.com.au", "hello@robinmacpherson.io", "heniarazgal@gmail.com", "hennapiirto@hotmail.com", "henriette@schoemaker.name", "hj.rutsch@gmx.de", "hmmallen@gmail.com", "hoangnguyen.uel@gmail.com", "hoda.ossoble@britishcouncil.org.cn", "hollyalbracht@hotmail.com", "homebody@mail.ru", "howardk@arrium.com", "htetkyaw94@gmail.com", "htlephan89@gmail.com", "huahan.shuya@gmail.com", "hubbabubba0000000000@gmail.com", "hubertsum@gmail.com", "hulishi@gmail.com", "husein.a.kadir@gmail.com", "huseyin_alpay@hotmail.com", "huyen.qingxuan@gmail.com", "huyue6915@gmail.com", "hysakoudom086@gmail.com", "i.alexandra6477@gmail.com", "iapanda@yahoo.com", "igann@hotmail.com", "igelera0@gmail.com", "ignis.fatuus1987@gmail.com", "igor.seredkin@gmail.com", "ilyaisaenko69@gmail.com", "info@annafurlaxis.com", "info@schaefer-intercultural.eu", "irina@familymeyer.net", "irinailina013@gmail.com", "irodriguez900@gmail.com", "isabellaeichler@msn.com", "isabellagiphone@icloud.com", "itakeaway@gmail.com", "itanikishor68@gmail.com", "itsmevalz@gmail.com", "iuliia.shapovalova16@gmail.com", "ivymay3110@gmail.com", "j.j.h.vanstraalen@gmail.com", "jacelnazaria35@gmail.com", "jacob.hfan@gmail.com", "jacqueline.wagner12@gmail.com", "jadwigasak.tlumacz@gmail.com", "jaimeocon10@gmail.com", "jakekim0906@gmail.com", "jakobandreasmeldgaard@gmail.com", "jameslinkousdc@gmail.com", "jamesproudfoot@hotmail.co.uk", "jamesthro@yahoo.com", "jamie294@live.co.uk", "jamiequint@gmail.com", "jancrismoral@gmail.com", "janechuang4@gmail.com", "januszgol@o2.pl", "jao.satpal@gmail.com", "japanese28os@gmail.com", "jason.c.chua@gmail.com", "jasonworth777@gmail.com", "jazzjarr@yahoo.com", "jbird2772@icloud.com", "jbweimar@gmail.com", "jcklong168@gmail.com", "jdelion@gmail.com", "jdhouse01@gmail.com", "jdj@jamesdjameson.com", "jeanette.netzel@gmail.com", "jeffbolte@yahoo.com", "jeffperenne@gmail.com", "jennifer.birdsong@cdischina.com", "jennleighlandry@gmail.com", "jeremy@seligman.info", "jesserdk@gmail.com", "jessicabernstein69@gmail.com", "jessxmillen@gmail.com", "jfammirati@gmail.com", "jfbelleau@gmail.com", "jgaillard@hotmail.ch", "jgcollins1969@gmail.com", "jhatfield.clevel@gmail.com", "jhojho0217@gmail.com", "jhon.manayan@gmail.com", "jim@jimmcleod.net", "jin6er@gmail.com", "jjdoc@ieb-group.com", "jkaltreider@gmail.com", "jlswedberg@yahoo.com", "jmay@pobox.com", "jmschrei@gmail.com", "joan.molina.urquizu@gmail.com", "joannasiebert@yahoo.com", "joanne.liu@hotmail.co.uk", "joaovcampos@gmail.com", "joaquim.nassar@gmail.com", "joenicastri@gmail.com", "joey.grace@icloud.com", "joeyyungsama@gmx.de", "john@chandlergroup.com.au", "johnhoney88@gmail.com", "johniris@buffalo.edu", "johnkielty@gmail.com", "johnperks@gmail.com", "johntylernash@gmail.com", "jon@jonathan-lane.com", "jonah27117@gmail.com", "jonathanfu@gmail.com", "jonshawna@gmail.com", "joonas.jokela@gmail.com", "jordan-leoni@hotmail.com", "jorgeplanello@gmail.com", "joris.cracco@telenet.be", "joseph@mangino.co", "josephineholm@live.dk", "joshua.e.adkisson@gmail.com", "joshua@jramo.com", "joshvasil@gmail.com", "joshwaltemeyer@gmail.com", "jovanna.jiaying@gmail.com", "joy.sarkar07@gmail.com", "jpreysouto@gmail.com", "jrpima@gmail.com", "jsaaw@yahoo.com", "jszuluaga90@hotmail.com", "julia.roennau11@gmail.com", "juulia.pietila@gmail.com", "jvanschooneveld@gmail.com", "k-vd-slacht@gmx.net", "k.sarah.y@gmail.com", "kaitlin.ruiter@cdischina.com", "kaixin.shum@gmail.com", "kalotes62@gmail.com", "karencox8@gmail.com", "karl@audiovibes.co.uk", "kash.kj@gmail.com", "katerina_ignasheva@bk.ru", "katesmirnovaofficial@gmail.com", "kathryn@chinesepod.com", "kathryn@thinkonething.com", "katokat17@gmail.com", "katrin.draemann@bluewin.ch", "katy.sinnott@wedc.org", "kayleehenderson050@gmail.com", "kblanc@comcast.net", "kbullaughey@gmail.com", "kcbshaw33-yoyoch@yahoo.com", "kdwalsh47@gmail.com", "kent.kedl@controlrisks.com", "kenwoodvideos21@gmail.com", "keriolivas@gmail.com", "kgoodway@gmail.com", "khartma1@gmail.com", "khavronenkomax@gmail.com", "kian248@gmail.com", "kiaraboffin1@hotmail.com", "kiaro3@yandex.ru", "kieran.jarrod@gmail.com", "kimberlieagulto@yahoo.com", "kirecciazra@gmail.com", "kitpcollins@gmail.com", "kny11122@gmail.com", "kody.messner@gmail.com", "konrad.read@gmail.com", "kovacsviksa@gmail.com", "kovacsxgregory@gmail.com", "kratoviliv@hotmail.com", "krieglicht@gmail.com", "krisbmiller@gmail.com", "kruse.andrew@gmail.com", "kyleessary@fastmail.com", "kyliemccallum1@gmail.com", "kyungkhuynah1216@gmail.com", "ladaiconic@mail.ru", "langstonlmcs@gmail.com", "laura.breitenberger@konzept-e.de", "laura.enjolras@hotmail.it", "laura.gaeta98@libero.it", "laura.herbst@gmail.com", "lauren.collins@du.edu", "lavanyanatesha@gmail.com", "lavatein@lavatein.com", "laychkoh@gmail.com", "learnalot1231@gmail.com", "lee.allen@zoho.com", "legainsley@gmail.com", "lenakul2005@gmail.com", "leroydavidandrei@gmail.com", "lewis.abarrow01@gmail.com", "lewkaz@yandex.com", "lex.stuartwatt@gmail.com", "liachanz.1205@gmail.com", "licel5800@gmail.com", "lidmitriy508@gmail.com", "lilashayo@gmail.com", "lillianyuen@aol.com", "lilytong@hotmail.com", "lin.sha2@det.nsw.edu.au", "linameun168@gmail.com", "linauon99@gmail.com", "lindapost@zonnet.nl", "lingchang94@ucla.edu", "linnea.mintzer@gmail.com", "liplovez@yandex.ru", "lisa.co@hotmail.fr", "lisalin1306@gmail.com", "littlefm@iu.edu", "live-1@live.com.au", "livnu@online.no", "liza-trusova@mail.ru", "lizabethjhayes@yahoo.com", "lizbrix@yahoo.com", "lizeconomy@gmail.com", "lkbarnwell@gmail.com", "lkendl@live.com", "lloydnariz@gmail.com", "lmbjre8@aol.com", "loannth94@gmail.com", "lokysayed@gmail.com", "louismakoni@yahoo.co.uk", "lourdes203@gmail.com", "lpement@gmail.com", "lrt@iinet.net.au", "ls.sarno@gmail.com", "lubava.shanghai@gmail.com", "lucasl2000+junk@gmail.com", "lucille@chinesepod.com", "lucyemersonhaagen@gmail.com", "lui.isaeva@gmail.com", "luisixoye@gmail.com", "luislopezlol29@gmail.com", "luka.stefancic@gmail.com", "lukaszsosnowski@hotmail.com", "lumilumi_@hotmail.com", "m@rcuss.com", "maclauxxl@yahoo.com", "mahei007+chinesepod@gmail.com", "mahori.ben.ren0904@gmail.com", "maianh10042k@gmail.com", "mail@wolfram-erhardt.de", "maks.chrapusta@gmail.com", "malengusosie3@gmail.com", "malladi@gmail.com", "mallea1810@hotmail.com", "malsky.john@gmail.com", "mansergh@gmail.com", "mansour.696@gmail.com", "mantisbead@gmail.com", "maratik_87@list.ru", "marc.henderson@yahoo.com.au", "marcel.herrig@unicut-design.de", "marcieflorez@outlook.com", "marco@preiss.co.uk", "marcus.j.90@web.de", "marfalogia@gmail.com", "marian_kasprowski@gmx.de", "mariapia.maggioni@ucs.org.uk", "maribur@hotmail.com", "mariia.guseva@bk.ru", "marikashanahan@gmail.com", "marine.louka@hotmail.com", "marklogan1@live.co.uk", "markvuorela@gmail.com", "marlon@thinkonething.com", "marquezc883@gmail.com", "marta.anastazja.z@gmail.com", "martijnvanstraalen@hotmail.com", "martin.reidy@gmail.com", "martin_ivanov95@outlook.com", "marydebell22@yahoo.com", "mas123@hotmail.com", "maschenstrom@web.de", "matasov7@yandex.ru", "mathewjosemathews@yahoo.com", "matt.corkhill@gmail.com", "matt.meyers@qlocal.com", "matt.parrett@gmail.com", "mattahmet@gmail.com", "matthew.root@gmail.com", "matthewbuckley@hotmail.com", "matthewethanko2008@gmail.com", "max.adomako@gmail.com", "maximilian.kudler@gmail.com", "maxroyb@gmail.com", "mayfair07@mail.ru", "mdklein1@gmail.com", "mefat54@gmail.com", "mega.lunika@ukr.net", "meird2009@gmail.com", "melda_34@yahoo.com", "melisa.hrnjic.1998@gmail.com", "melissa.chura@hotmail.com", "merce2mail@yahoo.es", "merlo_dg@hotmail.com", "merryjos24@gmail.com", "mezzaid2@yahoo.com", "mfairmer@aol.com", "mfhawley5@gmail.com", "mia.lee@cdischina.com", "micgun@icloud.com", "michael.degtyarev@gmail.com", "michael.h.miller3@gmail.com", "michael@mcinmotion.com", "michaelrgalloway@gmail.com", "michellecox99@gmail.com", "mike.jones.personal@gmail.com", "mike_10017@yahoo.co.uk", "mimiferraro@gmail.com", "miranda.a.jarrett@hotmail.co.uk", "mishmarcs@gmail.com", "missdi.7337@gmail.com", "misshsv69@gmail.com", "mjhpublic@gmail.com", "mjirout@gmail.com", "mjm470818@yahoo.com", "mkim10@gmail.com", "ml4him@gmail.com", "mlee@sonic.net", "mmganz@gmail.com", "mnberumen@yahoo.com", "mo_washi@yahoo.co.jp", "modelo8412@gmail.com", "moha.emam94@gmail.com", "mohd_lola@yahoo.com", "mondayblues@gmail.com", "moneyhunster@hotmail.co.uk", "moonstone4u6@gmail.com", "mor37rgr38@gmail.com", "mortmordre@inbox.ru", "mouadafsahi6@gmail.com", "mr.schwartzbeck@gmail.com", "mrdoctorm@hotmail.com", "mreitz.dmu@gmail.com", "mrowens10@yahoo.com", "ms.davison@aol.com", "mscandicedeville@gmail.com", "msg.jonshin@gmail.com", "msr143c@gmail.com", "mtoroglu@gmail.com", "muguang.xili@gmail.com", "muhhamedjackson@gmail.com", "mundrihartos@aiias.edu", "mungaya.irene@yahoo.com", "mvdelshout@childrenslaureate.org.au", "mwhegerman@gmail.com", "myers821@gmail.com", "myles.macvane@gmail.com", "mzeek88@gmail.com", "n.nagendrakumar@gmail.com", "nacky_th@hotmail.com", "nadine.coloignier@mfa.no", "nadineong1@yahoo.com", "nadung1986@gmail.com", "nadya_rya@mail.ru", "nairajay743@gmail.com", "namwu1@gmail.com", "nancy.blanckaert@gmail.com", "nangmai1102@gmail.com", "napakul.ly@gmail.com", "narellemallett@yahoo.com", "natabates@gmail.com", "natrjames@gmail.com", "neigenuit@gmail.com", "nelianfontilo0325@gmail.com", "nerrissavi@hotmail.com", "netamsc@outlook.com", "nfray88@gmail.com", "nguyendd2@mac.com", "ngymark@gmail.com", "nhamralizoda@gmail.com", "nhathun444@gmial.com", "nhi@witty.com", "nhoc611@gmail.com", "nicholas.jj@gmail.com", "nicholas.rossi@synthego.com", "nichole.younglin@gmail.com", "nickmarsh2002@yahoo.co.uk", "nickp@noeers.com", "nicolas.guillemin@gmail.com", "nicosiafilippo@yahoo.fr", "nightscapetarot@gmail.com", "niketvaidya@gmail.com", "nikitaivanov8896@gmail.com", "niklas.lindholm@outlook.com", "ningzhongenglish2018@gmail.com", "nirfeldman20@gmail.com", "niritst@gmail.com", "nitatryth@gmail.com", "niz.r@hotmail.com", "njcallram@gmail.com", "nmhorn@gmail.com", "nminogue@bigpond.net.au", "nmohara@gmail.com", "noelletriaureau@gmail.com", "nooratia9@gmail.com", "numairmqureshi@gmail.com", "number1nub@gmail.com", "nupurtakwale@gmail.com", "nylahgeorge@gmail.com", "obaglan@hotmail.com", "oceansponyo@protonmail.ch", "odetti@gmail.com", "odirrag00@hotmail.com", "olapelister143@gmail.com", "oldrussianmurloc@gmail.com", "olenamzlk@gmail.com", "oliamac@mail.ru", "olivia.johnson@cdischina.com", "olivierfaneuil@gmail.com", "omiboy.1913@gmail.com", "one_allen_wrench@yahoo.com", "onslotx@gmail.com", "oosterveer@mac.com", "orangesetal@gmail.com", "orders77@comcast.net", "orelienmartin@hotmail.fr", "orsyr89@gmail.com", "oscarw2@hotmail.com", "oskar.sulowski@googlemail.com", "oswaldfernandez0214@gmail.com", "othmaneelhoussi2205@gmail.com", "oturnermajor@gmail.com", "ourybah1981@hotmail.fr", "p@dirac.org", "pablo_ferchi@yahoo.com", "pacelwp2@hotmail.com", "padensmith39@gmail.com", "page7418@comcast.net", "paladariel95@gmail.com", "pamela_young@hotmail.com", "panova.margarita98@gmail.com", "panzer.schnitzel@gmail.com", "parrotfish@destinymedia.co.uk", "pasotti@ucsc.edu", "patchy.aoy@gmail.com", "patmalolepszy@gmail.com", "patricgreze@neuf.fr", "patriciaraimundolpx@gmail.com", "patrickskelton1@outlook.com", "patricksourek@me.com", "patricktartar@gmail.com", "paul.vandenbijgaart@gmail.com", "paulakristianty98@gmail.com", "paulee@ymail.com", "paulo.palminha2004@gmail.com", "pawel@kunstman.net", "pdmholden@gmail.com", "pedro1087@hotmail.com", "pelr@me.com", "peterharmsen2001@yahoo.com", "peterk21@online.de", "pfgstudent2019@gmail.com", "pierre.samson.75@gmail.com", "pinkchii_blu@yahoo.com", "pnock@ccgs.wa.edu.au", "portgas.d.daichi@gmail.com", "post.jcs@outlook.com", "pranishchhetriabc@gmail.com", "pruel@me.com", "ps.norak@gmail.com", "ptlee115@aol.com", "ptrmagai@yahoo.com", "publicaccount17@unctest.com", "publicaccount18@unctest.com", "pujieming@gmail.com", "pweber-0001@t-online.de", "qingqiezijun@yahoo.com", "quangilymtics@gmail.com", "quyenphan.2010@gmail.com", "raabary@gmail.com", "rainer.golle@web.de", "rainer.stal@gmail.com", "ralph.rogers@britishcouncil.org.cn", "ramain0606snd@gmail.com", "ramoncarrenovillar@gmail.com", "ramy51_15@hotmail.com", "randa.recap@gmail.com", "randi@thinkonething.com", "raniakhrouch22@gmail.com", "raphaelwatson@gmail.com", "raqellew@gmail.com", "rau25052@gmail.com", "rayjisenberger@juno.com", "raymon2010@quicknet.nl", "raymond.pun464@myci.csuci.edu", "rb2352@gmail.com", "rcchen99@gmail.com", "rdtotel@gmail.com", "reapthewind@hotmail.com", "reblackwell3@gmail.com", "rei541@yahoo.com", "remi.kondjoyan@hec.edu", "renan.devillieres@gmail.com", "richfoc@gmail.com", "richpersonalmail@gmail.com", "rightnow931@yahoo.com", "rihuai@hotmail.com", "rino.columbo@gmail.com", "ripcurlchick_is@hotmail.com", "risviews@singnet.com.sg", "rjdhardesty@hotmail.co.uk", "rloolee89@gmail.com", "rlopezuricoechea@gmail.com", "robepon1@gmail.com", "robert.mooijekind@gmail.com", "robertjanuary@robertjanuary.com", "robinbarrett@hotmail.com", "rockzee1@yahoo.com", "roland.golz@outlook.de", "roman.shpakovsky@gmail.com", "roneltcheuno12@gmail.com", "rory_1991@live.nl", "rosewood139@yahoo.com", "rosskwong@gmail.com", "roswellhi@gmail.com", "roxanbaran09104746@gmail.com", "rtdlwy@gmail.com", "ruben@havsed.com", "rubenmitu@yahoo.com", "rubikcoder@gmail.com", "rudkoanna@gmail.com", "rurichan16@gmail.com", "rushi9325@gmail.com", "ruthkobe11@gmail.com", "ruvi092390@yahoo.com", "rwr_spicer@yahoo.com", "ryan.louay@gmail.com", "ryan.rubi@hotmail.com", "ryanchristie00@gmail.com", "ryanjohngray@hotmail.co.uk", "s.stangenberg@web.de", "sailingtobali@gmail.com", "saiyangirl_gogeta@hotmail.com", "samangelo47@yahoo.com", "samir0902@hotmail.com", "sander_trap@hotmail.com", "sandipniyogi786@hotmail.com", "sandraquynhtran@gmail.com", "sandraroeder@hotmail.com", "sarah.pa@hotmail.com", "sarahkpoon@gmail.com", "sarahweatherlake@gmail.com", "sararassner@hotmail.com", "sawaiak@gmail.com", "sbkane6@icloud.com", "scchenier@gmail.com", "schmitz.florian@hotmail.com", "scott.kirklin@gmail.com", "sean.clancy@britishcouncil.org", "sean@squigglo.com", "seangibsonxl@outlook.com", "sebbestahl@gmail.com", "selinacesc@googlemail.com", "semihzirapli@gmail.com", "seoujn@gmail.com", "sergienkodan00@mail.ru", "serhatsoylemez@windowslive.com", "seymourmjr@hotmail.com", "sfreytag7@gmail.com", "shadiesebas@gmail.com", "shadowser@live.be", "sharma.prajakta@gmail.com", "shawn.quigley12@gmail.com", "shenequadunn@gmail.com", "shrey.rissy@gmail.com", "shrimptontm@gmail.com", "shu_zilong@yahoo.com", "shuhrat.shukrulloev@mail.ru", "sidnatov101@gmail.com", "siirikinnunen02@gmail.com", "silva.hassert@gmail.com", "simon.higginson@britishcouncil.org.cn", "simon_ridley_walker@hotmail.com", "simoquadri93@hotmail.it", "sinadee@gmail.com", "singh.svetlana99@gmail.com", "sion.arthur@gmail.com", "sjrosof@gmail.com", "skhusbrem@gmail.com", "skjdaniel@gmail.com", "smallszach@gmail.com", "smburak@ualberta.ca", "smithterry8@aol.com", "smwalters02@gmail.com", "sobelman@umn.edu", "sobolenok-uliya@mail.ru", "sofewareoct@gmail.com", "sofiya_beym@list.ru", "solecf@yahoo.com", "somalita@gmail.com", "sonsan0091@gmail.com", "sowjsjsjs@yahoo.com", "spectatrix@gmail.com", "spgong@gmail.com", "sphelaninchina@hotmail.com", "sriramaneninavya@gmail.com", "stan3812@gmx.net", "stanfujyeemori@gmail.com", "stephanie.rinkel@gmail.com", "stephankoch@besonet.ch", "stephenjrafferty@gmail.com", "steve@howlum.com", "steve@traplineproducts.com", "steven.cruden@gmail.com", "steven@petchon.com", "stevengs312@comcast.net", "stevenrosario@ymail.com", "sthakur26@gmail.com", "stphn.mrgn@gmail.com", "stristic@gmail.com", "stuart203@hotmail.com", "stuartstorry@gmail.com", "stumpymcpeg@gmail.com", "sub_baz30-09@mail.ru", "summerwater@gmx.com", "sundayojo95@gmail.com", "sunghwan.lee76@gmail.com", "suzanne.cummings11@yahoo.ie", "sven.van.roosbroeck@gmail.com", "svetlana.kosobokova@gmail.com", "swannquach@gmail.com", "swfackler@gmail.com", "sylviogh@gmail.com", "syppercow@gmail.com", "syy1375594878@gmail.com", "szczerbinski.jacek@gmail.com", "szczudlikjustyna@gmail.com", "tamayosinasia@gmail.com", "tamn171098@gmail.com", "taneeyaabasum9999@gmail.com", "tangerineda@gmail.com", "tania.branigan@googlemail.com", "tarikyi39@yahoo.com", "tddomd@hotmail.com", "tedxsmith@qq.com", "teresamsglouzada@gmail.com", "thaenuhtwe141@gmail.com", "thais_caroline@live.co.uk", "thanh.huyen280897@gmail.com", "thaolp2912@gmail.com", "thazinkh@gmail.com", "thele4doc@gmail.com", "themindfantastic@gmail.com", "theo-martin@hotmail.com", "theresiamarsha95@gmail.com", "thewendster@gmail.com", "thidaseng221220@gmail.com", "thomas.jankovsky@gmail.com", "thomas.rondot@gmail.com", "thomasappleyard@gmail.com", "thomasjkearneyjr@gmail.com", "thompsonnicole2003@yahoo.com", "thuyvi13dks@gmail.com", "tianosiakerejolaeminefo@gmail.com", "tikho@anor.net", "timka.alf@gmail.com", "timongalvarez@gmail.com", "timvish93@gmail.com", "tirzacortes8614@gmail.com", "tkhovanich@hotmail.com", "tmazzoni@tiscali.it", "tobinmr@gmail.com", "token@kinect.co.nz", "tomdepew@icloud.com", "tomlilleyone@gmail.com", "tomstarkey01@gmail.com", "tomtom92@msn.com", "tomward@pimchina.com", "toniwilleng@gmail.com", "tonjani08@gmail.com", "tonyhong8@yahoo.com", "trackme@nate.com", "trangle189@gmail.com", "trangnguyen.dh2000@gmail.com", "tranquanghuy.marc@gmail.com", "travellingroger@yahoo.com.au", "travisfosnight@gmail.com", "travisfosnight@yahoo.com", "trey.sisson@gmail.com", "trmarzullo@gmail.com", "tschi7@hotmail.com", "tsmithov@yahoo.com", "tsucharoku@gmail.com", "tylerbtbam@gmail.com", "ubteoman@gmail.com", "ugis+blackfridayproduction@chinesepod.com", "uh16@ic.ac.uk", "uiop11@posteo.de", "umittemel89@gmail.com", "un-chinesecenter@yandex.ru", "unghy@live.fr", "unnh2000@gmail.com", "usoff@rambler.ru", "vaczi@mac.com", "vadichito@gmail.com", "valentinadiazad@gmail.com", "vanessa.webel@hotmail.com", "vanho.vhtt@gmail.com", "vebum@joeneo.com", "veraayemere@gmail.com", "veroheim@gmail.com", "victor.harvey1@gmail.com", "victorginer@yahoo.es", "victoria.hammarstrand@gmail.com", "victoria.penu@gmail.com", "victorlinder90@gmail.com", "vidaideal.1355@gmail.com", "virginiamoscatelli@icloud.com", "vithuhien97@gmail.com", "vitomaz@gmail.com", "vjoanne@my.yorku.ca", "vkshipilov@gmail.com", "vkwans55@gmail.com", "voljskabulgaria@gmail.com", "vries101@gmail.com", "vulinh1412@gmail.com", "vuonghienhua1@gmail.com", "vuongnquoc@gmail.com", "w_kopulos@yahoo.com", "wandry35@gmail.com", "wanyier@gmail.com", "warwickd916@live.com", "wasenshi@gmail.com", "wattersmichael@hotmail.com", "weckmann@posteo.de", "welte.tobias@gmail.com", "wheelockjackie@gmail.com", "whisperwisp@hotmail.com", "william.nunes001@gmail.com", "williemcgee25@yahoo.com", "wmpoylee@me.com", "wntim@hotmail.com", "wolxey@gmail.com", "wryancartie@yahoo.com", "www.laokhay@gmail.com", "xavifs89@gmail.com", "xianaraidavis@gmail.com", "xiaoshui55@hotmail.com", "xizhong@nifty.com", "xmen72@optonline.net", "ya.litvyakovali@yandex.ru", "yagogimeno96@gmail.com", "yang.cao0828@gmail.com", "yangeliz@gmail.com", "yangie_rein18@yahoo.com", "yeohlc@hotmail.com", "yildizhk@gmail.com", "ymaeh_m_t_6_@scorpio.zaq.jp", "yolandaagnew71@gmail.com", "yonadaan@hotmail.com", "youssefbaidder4@gmail.com", "yrtfarro0100@gmail.com", "yularry@yahoo.com", "yusuke.suzuki@gmail.com", "yz4m@hotmail.com", "zahra.imani79@gmail.com", "zaogao56@gmail.com", "zinny196@gmail.com", "zitarix@o2.pl", "zoems@live.co.uk"];

    let userData = await sails.models['user'].find({email: {in: users}});

    let asiaCountries = ["YE", "IQ", "SA", "IR", "SY", "AM", "JO", "LB", "KW", "OM", "QA", "BH", "AE", "IL", "TR",
      "AZ", "GE", "AF", "PK", "BD", "TM", "TJ", "LK", "BT", "IN", "MV", "IO", "NP", "MM", "UZ", "KZ", "KG", "CC",
      "PW", "VN", "TH", "ID", "LA", "TW", "PH", "MY", "CN", "HK", "BN", "MO", "KH", "KR", "JP", "KP", "SG", "CK",
      "TL", "MN", "AU", "CX", "MH", "FM", "PG", "SB", "TV", "NR", "VU", "NC", "NF", "NZ", "FJ", "PF", "PN", "KI",
      "TK", "TO", "WF", "WS", "NU", "MP", "GU", "UM", "AS", "PS"];

    const europeanCountries = ["CY", "GR", "EE", "LV", "LT", "SJ", "MD", "BY", "FI", "AX", "UA", "MK", "HU", "BG",
      "AL", "PL", "RO", "XK", "RU", "PT", "GI", "ES", "MT", "FO", "DK", "IS", "GB", "CH", "SE", "NL", "AT", "BE",
      "DE", "LU", "IE", "MC", "FR", "AD", "LI", "JE", "IM", "GG", "SK", "CZ", "NO", "VA", "SM", "IT", "SI", "ME",
      "HR", "BA", "RS"];

    const geoip = require('geoip-country');

    userData.forEach(async (user) => {

      if (user.ip_address || user.country) {

        let geo = {};

        if(user.ip_address) {

          geo = geoip.lookup(user.ip_address);

        }

        if (job.data.group === 'asia' && (geo && asiaCountries.includes(geo.country)) || (asiaCountries.includes(user.country))) {


          let log = await EmailLogs.find({user_id: job.data.userId, email_id: {in: ['email-susie-inactive-user-europe', 'email-alice-inactive-user-asia']}});

          if (!log) {
            sails.hooks.bugsnag.notify('Send Email to Asia');

            userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-alice-inactive-user-asia', country: geo.country})

          }

        } else if (job.data.group === 'europe' && (geo && europeanCountries.includes(geo.country) || europeanCountries.includes(user.country))){


          let log = await EmailLogs.find({user_id: job.data.userId, email_id: {in: ['email-susie-inactive-user-europe', 'email-alice-inactive-user-asia']}});

          if (!log) {
            sails.hooks.bugsnag.notify('Send Email to Europe');

            userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-susie-inactive-user-europe', country: geo.country})

          }


        } else if (job.data.group === 'testing') {

          console.log(JSON.stringify({...user, ...job.data}));

        }

      }

    });

    done()

  });


  emailTriggerQueue.removeRepeatable('SendEmails', {repeat: {cron: '*/15 * * * *'}});

  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmails', {repeat: {cron: '*/15 * * * *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 9 24 1 *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 16 24 1 *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '*/10 * * * *'}});

  // emailTriggerQueue.add('ScheduleInactivityEmails', {data: 'Send Follow-up email to recently inactive users'}, {repeat: {cron: '*/15 * * * *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'asia'}, {repeat: {cron: '55 9 24 1 *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'europe'}, {repeat: {cron: '55 16 24 1 *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'testing'}, {repeat: {cron: '*/10 * * * *'}});

}
