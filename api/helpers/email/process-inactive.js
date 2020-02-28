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

    let emailList = (await EmailLogs.find().select('user_id')).map(item => item.user_id);

    let liveUsers = ["1664703125@qq.com", "18704018176@163.com", "1bsgk16@gmail.com", "2010.sandhya@gmail.com", "2112alphaeuslopez@gmail.com", "247anacleto@gmail.com", "7mgoulding7@gmail.com", "859924228@qq.com", "Andreas.Staab@gmx.net", "AndySang94@gmail.com", "Cbowma4@gmail.com", "Charles.Lutz35@qq.com", "Dprince955@yahoo.ca", "Erikschaepers@gmail.com", "JanOetting@gmail.com", "Jessicashelley99@gmail.com", "Katerina_ignasheva@bk.ru", "Msg.jonshin@gmail.com", "NARYB@Yandex.ru", "Neil@whitecranefightingarts.com", "Nickcardinez@hotmail.com", "NormKR@aol.com", "SThirlwell@yahoo.com", "Spencerholgate@gmail.com", "Swgaskey@gmail.com", "Wattersmichael@hotmail.com", "Xie.gerry@outlook.com", "a.frankcharm@gmail.com", "a.nerwinska@gmail.com", "a@malafeev.com", "aaron.baideme@gmail.com", "aaronposehn@gmail.com", "aaxp1234567890@gmail.com", "abehrendt@vms.edu", "abi.service@outlook.com", "abitea109@gmail.com", "abonidenobili@gmail.com", "absterpurple@gmail.com", "acdavi9@emory.edu", "achanger2@gmail.com", "achisyamnur@gmail.com", "achorn@bigpond.com", "acowburn@gmail.com", "acwarr@gmail.com", "adam.e.hamilton@gmail.com", "adamr424@gmail.com", "adeline.herrou@mae.u-paris10.fr", "adrian.hosler@gmail.com", "adscholes@gmail.com", "aemcclary@gmail.com", "agnesboubenec@yahoo.fr", "agripp36@gmail.com", "ahmed.boudouch@yahoo.com", "aidana9841@mail.ru", "aistekietyte@gmail.com", "ajcaballero9@hotmail.com", "akaneemagi@gmail.com", "akifalcon@gmail.com", "alberterrickson@gmail.com", "aleahking12@email.com", "aleksandrashirokova2001@yandex.ru", "alemagnan@me.com", "alenachel@bk.ru", "alex@alexgottlieb.com", "alexandereroberts@hotmail.com", "alexandra.kohring@gmail.com", "alexbycroft@hotmail.com", "alexss@hotmail.ca", "alexsumerall@gmail.com", "ali.robert04@gmail.com", "alice.steinpilm@gmail.com", "alicewindeyer@gmail.com", "aliesraa583@gemail.com", "alihussainshahi3373@gmail.com", "alinagrigorieva9@mail.ru", "aliu@briclanguage.com", "aljsilverman@hotmail.com", "allyxcong@gmail.com", "alma.chen@grupobimbo.com", "aluminiumoxide@hotmail.co.uk", "alvaroems@gmail.com", "alvaropecogarcia@gmail.com", "amalia.ulman@gmail.com", "amanda.morrison@sc.tsinghua.edu.cn", "amellahnixo@gmail.com", "amifelder@gmail.com", "amy.hallam@gmail.com", "amykiely95@gmail.com", "andepede@gmail.com", "andreas_gran@web.de", "andreea.leonte@ymail.com", "andrekteng@gmail.com", "andres3546@hotmail.com", "andrew00david@gmail.com", "andrew45jwhite@gmail.com", "andrewc.jigsawit@gmail.com", "andrewclark44@hotmail.com", "andrusovo@yandex.com", "angeechen8@hotmail.com", "angelannaandrade1344@gmail.com", "angeldany1977@gmail.com", "anheche@gmail.com", "anja.vangeert@astraya.eu", "anm1607@mail.ru", "ann.veeck@wmich.edu", "annabeljanekeville@hotmail.co.uk", "annabellabeck300@hotmail.com", "annaefre@yahoo.it", "annahomehappy@gmail.com", "annakatapiotrowska@gmail.com", "annedtrobin@gmail.com", "anneobi15@gmail.com", "annijavaldaz@gmail.com", "antonella.162410@gmail.com", "antonio.barbarossa@gmail.com", "apetina@gmail.com", "arhaluk1@gmail.com", "ari.harmaala@metsagroup.com", "aria.nikmo@gmail.com", "arnoud.van.doorenmalen@gmail.com", "arthur.querimit@yahoo.com", "asfardi@gmail.com", "asgeir.dybvig@gmail.com", "asha.arul@cdischina.com", "ashley.fornaro@gmail.com", "asig4@yahoo.com", "asma.a.alhammadi@outlook.com", "asteluxjp@gmail.com", "astolen@gmail.com", "atgburger@gmail.com", "atkinsashleyr@gmail.com", "atlantasteve922@gmail.com", "auenwald19@gmail.com", "aumaryom@gmail.com", "austejatreinyte@gmail.com", "austin.conder@outlook.com", "autogpsdvds@gmail.com", "avarnavski@yahoo.com", "avery.nielsen@gmail.com", "axel.gronberg@gmail.com", "aya.mehanna@gmail.com", "ayatoghoul14@gmail.com", "ayod79@gmail.com", "ayu76dyah@gmail.com", "azeredudu1@gmail.com", "bakayegorrr@gmail.com", "bamlak2013@gmail.com", "banestower@yahoo.com", "barrie_jeffrey@hotmail.com", "barrioscastineyra@gmail.com", "barryibrahima100@gmail.com", "bart.nauwelaers@esat.kuleuven.be", "baumer.konstantin@gmail.com", "bayuval@gmail.com", "bazouaa.jozfin@gmail.com", "beabonne.sc@gmail.com", "beacota@outook.it", "bel.f.joel@gmail.com", "belyaeva.galya@gmail.com", "ben@reynwar.net", "benjamin.nicholson@live.co.uk", "benleewrites@gmail.com", "bennett.faber@liulishuo.com", "benrhopper@gmail.com", "bensky.cook@me.com", "bensondacia@gmail.com", "berkanosowelu@gmail.com", "bessiereslea@yahoo.fr", "betoperetti@gmail.com", "beverliechua@gmail.com", "bhai_31@yahoo.com", "billh.zuo+pod@gmail.com", "billy.miner@gmail.com", "billy@billysdomain.net", "birgir.johnsson@gmail.com", "bjnav@naver.com", "bkanat1602@gmail.com", "bkejr@hotmail.com", "bkm@magierski.com", "block_obs@web.de", "bloffler@iinet.net.au", "bluefootedbooby07@gmail.com", "bluezephyr11@gmail.com", "bnel1201@gmail.com", "bobolee69@gmail.com", "bodeng93@hotmail.com", "boenes67@gmail.com", "boskodrums@gmail.com", "boubaguelinn@gmail.com", "bparrent1@cougarmail.collin.edu", "brad@snippts.app", "bradyvut@googlemail.com", "brandon.krabbenhoft@outlook.com", "brandon.wyatt@rocketmail.com", "brandon@steezy.co", "brandonjnascimento@gmail.com", "braxgirtman11@gmail.com", "braydenisrealhinton@gmail.com", "brazilabe@gmail.com", "brendanoch@gmail.com", "brenna.shepherd@britishcouncil.org.cn", "brennancrc2@yahoo.co.uk", "brenton.bills@gmail.com", "brian@praxis8.com", "brianwashburne@gmail.com", "bridget_benson@msn.com", "brittonwolfhenry@gmail.com", "brunopreciado@msn.com", "bryan_po_1005@yahoo.com", "brydonpbrancart@gmail.com", "buero@coverspot.com", "bulaunglendy@gmail.com", "burak.yelkovan@gmail.com", "buttetb@gmail.com", "byronforrestwhite@gmail.com", "byront3@gmail.com", "c.s.massingham@gmail.com", "callsheldon@gmail.com", "camcham2@hotmail.com", "camelchasers@yahoo.com", "camerongwillard@yahoo.com", "campbellyoung36@gmail.com", "captainmatthew@shaw.ca", "carmaelharazi0@gmail.com", "carmensimioli2@gmail.com", "casey_steve1@yahoo.com", "cass.travis004@gmail.com", "caudelan@gmail.com", "cbc16blu@fastmail.com", "cbowma4@gmail.com", "cbrowne888@yahoo.com.au", "cc.2828@hotmail.com", "celiaarkein@gmail.com", "cg123192@yahoo.com", "chadyelayne4@gmail.com", "chaimaelakhdar48@gmail.com", "chandaho@gmail.com", "chander.kant@gmail.com", "chanwy6@yahoo.com", "charlenebousquet@gmail.com", "charles.humblet@gmail.com", "charlesfrancisyahoo@gmail.com", "chason.dailey@gmail.com", "cheakrem066@email.com", "chebiichris@icloud.com", "cherleneye@gmail.com", "china@teatracks.com", "chinese@destinymedia.co.uk", "chinesepod@collinstarkweather.com", "chinesepod@medworth.org.uk", "chinesepod@ydyd.de", "chinitoinca@gmail.com", "chino.g@yandex.com", "chmyanpyi.syd@gmail.com", "chownickj@gmail.com", "chrisberragan@gmail.com", "chrisdelyer@gmail.com", "chrismotyka@gmail.com", "christian.devillers@walkin.com.cn", "christian.forestier@gmail.com", "christian.goerlitz@gmail.com", "christian.hassanaly@gmail.com", "christian.muller@mae.etat.lu", "christian_zohmann@yahoo.de", "christina.trbovich@gmail.com", "christine.blesinger@rwth-aachen.de", "christophe.caulet@gmail.com", "christophe.vanngocty@gmail.com", "christopher0302@windowslive.com", "chrisveits@gmail.com", "chrka@mac.com", "chuckhui0521@gmail.com", "cifi@gmx.net", "cihatacar78@gmail.com", "cinarari8@gmail.com", "ckaifil@gmail.com", "claireakovacs@aol.com", "clancyadam@gmail.com", "claraspoutnik@gmail.com", "clarkcrookshanks@gmail.com", "claudeeric75@gmail.com", "clemm@live.nl", "cliffclam@yahoo.com", "cmccraydavis@gmail.com", "co_zaldy@yahoo.com", "cody.lee.wolf@gmail.com", "codym@utexas.edu", "colin.brown@allegion.com", "communicationtsui@gmail.com", "conall.cassidy@yahoo.co.uk", "contact@myadvice.com.au", "copingskillsworkshop@gmail.com", "cpod@futureresearch.com", "cr8onking@gmail.com", "crismalync@gmail.com", "crossman.jodie@gmail.com", "crsdnn@outlook.com", "crystalgutjahr89@gmail.com", "csaftner@olsh.org", "csfy3g95kd@liamekaens.com", "cswillford@outlook.com", "cvmorenes@hotmail.com", "czobrist@gmail.com", "d.josephlee@outlook.com", "dag@oestlin.se", "dagneyeshiwas@gmail.com", "dakhenry@gmail.com", "dakotabookseller@gmail.com", "damianij@umich.edu", "damonlh@gmail.com", "dang.nguyen501@gmail.com", "daniel.abdelsayed@outlook.com", "daniel.l.wetzel@gmail.com", "danil1996_96@mail.ru", "dant123@gmail.com", "daphne_7dawn@yahoo.com", "dasca.chris@gmail.com", "datnguyen19012000@gmail.com", "davann69chhin@gmail.com", "dave@webtail.be", "davesousa@aol.com", "david.vaughn@laposte.net", "david@thenewmans.com", "david@wordwok.com", "david_oloughlin@hotmail.com", "davidemiculan@gmail.com", "davidjayposner@gmail.com", "dcschnerr@yahoo.com", "dcsleeps@gmail.com", "ddiu@student.unimelb.edu.au", "de.vraisemblance@gmail.com", "deadlyguitar502@gmail.com", "dennisds.park@gmail.com", "dermotamcgrath@gmail.com", "derrick@derricksiu.com", "derrick@superfly.asia", "derrickjarmstrong@gmail.com", "dexdiu@gmail.com", "dezza11bonifacio06@gmail.com", "dfetty@qwestoffice.net", "dgeorge1525@gmail.com", "dgtully@gmail.com", "dholl18@eq.edu.au", "diarmaiddillon@gmail.com", "dickbuxton@gmail.com", "dipakyoga@outlook.com", "djvisentin@gmail.com", "dl334pa@gmail.com", "dmcd02@yahoo.ca", "dmitry.gulyaev@gmail.com", "dmloadm@yahoo.com", "dmoraga@hotmail.com", "dmuffley@hotmail.com", "doji.star@gmail.com", "dominikatakacs970@gmail.com", "doritosomar2010@gmail.com", "dothuhangk60@gmail.com", "doughertyjamesp@gmail.com", "dpc118@hotmail.com", "dpozn001@fiu.edu", "dremova.official@gmail.com", "drexlermonika@t-online.de", "drjody@protonmail.com", "drtraceylee@yahoo.com.au", "dsgibson42@gmail.com", "dudasato.ms@gmail.com", "duke6585@hotmail.com", "duyminhcuong@gmail.com", "e.mel@live.be", "e.s.01@hotmail.com", "e0470155@u.nus.edu", "eavontuur@yahoo.com", "eb22826@gmail.com", "ebel.thomas@t-online.de", "ecemsenyuz@gmail.com", "ed.blockwise@gmail.com", "edentelake15@gmail.com", "edmund-lowe@live.co.uk", "eduardo.batista@sc.tsinghua.edu.cn", "edweng@gmail.com", "eekf89@gmail.com", "eelcow@gmail.com", "eeren7389@gmail.com", "egonza99@gmail.com", "eisuke.kawano@gmail.com", "ejalm@mit.edu", "ejkelsall03@gmail.com", "ejppickles@gmail.com", "el8130@gmail.com", "elena.smirnova1001@gmail.com", "elisapalanga0@gmail.com", "elisaw89@hotmail.com", "elite40000@hotmail.com", "ellen@adamstech.com", "elliehalla@googlemail.com", "elsa.calley@gmail.com", "elsubscriptions@ccgs.wa.edu.au", "ema.ballo@fastwebnet.it", "email@constanze-angermann.de", "emanuelbranco@gmail.com", "emanvskratos@yahoo.com", "emir.gress@gmail.com", "emmarenshaw@gmail.com", "emvttgonzo@gmail.com", "engelchen66.lili@gmail.com", "eparhuts@yandex.ru", "eqfostvedt@ucdavis.edu", "erdoes@gmail.com", "eric.baranes@gmail.com", "eric.engle@yahoo.com", "eric.lim105@gmail.com", "ericabrackman@gmail.com", "erickess@gmail.com", "erika@drazan.net", "erstlingandrea@gmail.com", "escobardina44@gmail.com", "eslate77@yahoo.com", "ethanljmitchell@gmail.com", "eugenezubrev@gmail.com", "evelyn_huang25@hotmail.com", "eynsalehi.6670@gmail.com", "fanarikfanarik@gmail.com", "faraska98@gmail.com", "farathniaz@gmail.com", "farrelke@tcd.ie", "fayyaz_baig74@yahoo.com", "ferenc.acs@web.de", "fetu@gmx.de", "ffoofat@yahoo.ca", "filipemorais25@hotmail.com", "findruard@gmail.com", "finlay.mccall@insearch.edu.au", "fitzpatrickdvm@gmail.com", "fjarenales@gmail.com", "fk416576@gmail.com", "florescaraphaelangelo@gmail.com", "florian.flietner@googlemail.com", "folaide@hotmail.com", "fontenotcherie@gmail.com", "foodman@chef.net", "forsakenyou1213@gmail.com", "fotingkempchee@gmail.com", "francois.ball@outlook.com", "frankhucul@gmail.com", "franky196@hotmail.com", "frasson.elena@gmail.com", "fred.chang.h@gmail.com", "freshgreenteacups@gmail.com", "friemanw@gmail.com", "fritjof2211@yahoo.de", "frosinonecalcio1993@yahoo.com.au", "fujitani@sei.co.jp", "funtoursfun@hotmail.com", "furtuna0711@gmail.com", "g8h8y8@hotmail.com", "gabriel@valentedosreis.com", "gaiamanzotti@gmail.com", "garrett.callen2@gmail.com", "garysaville@gmail.com", "geaninenz@gmail.com", "geeskeintvelt@xs4all.nl", "geloamg@protonmail.com", "geminiano.chiesa@fastwebnet.it", "gemma.yarger@gmail.com", "gemma_gem_5@hotmail.com", "geninhaflores@hotmail.com", "georgesande95@gmail.com", "gerald.cavanagh@sky.com", "gerard@pynter.nl", "gerardo.valdez@comcast.net", "gerardogomez1751@gmail.com", "gerrit.chinesepod@gmail.com", "gerritjung@gmail.com", "gerson.penha@gmail.com", "ggoldmanemail@gmail.com", "giangdh89@gmail.com", "giaotruong@yahoo.com", "giorgos.panagiotopoulos@gmail.com", "gmaris2001@gmail.com", "gmie061723@gmail.com", "gmyachtsman@yahoo.com", "gracechen7874@gmail.com", "grantzimm@gmail.com", "graves.daniel@gmail.com", "greg.arney@gmail.com", "gretel230914@gmail.com", "grldnmars@gmail.com", "gsstine80@gmail.com", "guentherhake@icloud.com", "gulya.09@inbox.ru", "gwendolynelisenunez@gmail.com", "gyoung9@hawaiiantel.net", "hahn@biologie.uni-kl.de", "hakimmeddour@yahoo.fr", "haleshipton@gmail.com", "hamsterra@gmail.com", "hannes.probach@gmx.de", "hariharicube@gmail.com", "haroldfinch01@yahoo.com.tr", "harrisrahman8@gmail.com", "hb.hamish3@gmail.com", "hcent898@gmail.com", "hcusujata@gmail.com", "hdahn@live.com", "heathergarner@student.olympic.edu", "heidrich@comcast.net", "heike.muennich@posteo.de", "helen@bannigan.com", "helenalexandra3001@gmail.com", "hello@robinmacpherson.io", "henry.zhenlun.tu@gmail.com", "henryoddi@gmail.com", "henrywangberkeley@gmail.com", "herbal7ea@gmail.com", "hernandezrafael@hotmail.com", "hgurofsky@gmail.com", "hieumcao@gmail.com", "hinmanta@gmail.com", "hiyarbeast@gmail.com", "hkc.sap@gmail.com", "hohengteong@gmail.com", "hokiepokyx@gmail.com", "holenkjersti@gmail.com", "holenstein_p@hotmail.com", "hollandronan@gmail.com", "hollyalbracht@hotmail.com", "hoowhatwen@gmail.com", "hopkins.jamest@gmail.com", "horae@xtra.co.nz", "howard@achievingisbelieving.com", "hschwegler@gmail.com", "huahan.shuya@gmail.com", "hudecovahellen@gmail.com", "hugh.grigg@gmail.com", "hugopenrose@gmail.com", "hungtvktdt@gmail.com", "i.have.ran@gmail.com", "i@stock.by", "ianmbentleyaus@gmail.com", "ice_songs@yahoo.com", "idanb@gornitzky.com", "idelya97@yandex.ru", "ievaivaskeviciute01@gmail.com", "igroberts11@gmail.com", "ihartny@hotmail.com", "ikezoye@msn.com", "info@annafurlaxis.com", "info@dagmar-wildenhain.de", "info@schaefer-intercultural.eu", "info@whitetigerqigong.com", "instar08@gmail.com", "intgsull@g.ucla.edu", "iohannesspam@posteo.de", "irene.sakaliuk@yahoo.com", "ireon@iinet.net.au", "irimazan@gmail.com", "irisono@gmail.com", "isaia.pruneddu@yahoo.com", "isseih63@gmail.com", "itay.zuker@gmail.com", "its+lab2@reed.edu", "ivan.f.pineda.fin@gmail.com", "ivanbrut@gmail.com", "ivyzhao210@gmail.com", "jackiannawheelock@gmail.com", "jackmono@interia.pl", "jacobdufault@gmail.com", "jade30x@live.ca", "jake.reid.browning@gmail.com", "jakehone@gmail.com", "jamesc.carpenter35@gmail.com", "jamesianjarman1987@gmail.com", "jameson.wu@yahoo.com", "jamesonlee125@gmail.com", "jamsenap@gmail.com", "janainasbg@gmail.com", "janerik.bredfeldt+chinesepod@googlemail.com", "janm@bigpond.net.au", "janoetting@gmail.com", "januszgol@o2.pl", "jasminespeer530@gmail.com", "jason.c.chua@gmail.com", "jason.schuurman@gmail.com", "jason@chinesepod.net", "jayaganesh78@gmail.com", "jb@aye0.com", "jbm237@nyu.edu", "jcdavenport55@gmail.com", "jcondon1@sbcglobal.net", "jczerwinska@icloud.com", "jeff@jefflindsay.com", "jeff@tinyloft.com", "jenna.leihgeber@gmail.com", "jennlidstone@gmail.com", "jernejster@gmail.com", "jerome.peco@gmail.com", "jerome.prada@yahoo.com", "jesse.ryan.segura@gmail.com", "jesse@welldinosaursupplier.com", "jessica.ianniciello@gmail.com", "jessicalshu@gmail.com", "jessxmillen@gmail.com", "jesuscstro7@gmail.com", "jfancsali@excelforms-graphics.com", "jfought@gmail.com", "jgprocter@btinternet.com", "jgr1083@yahoo.com", "jha16@alumni.princeton.edu", "jhandaya@gmail.com", "jhidalgo69@me.com", "jhklose@icloud.com", "jialynn.yang@gmail.com", "jibingeoji007@gmail.com", "jinshakira@yahoo.com", "jiuyen@gmail.com", "jjdoc@ieb-group.com", "jlikhananont@gmail.com", "jlswedberg@yahoo.com", "joab.dean@yahoo.co.uk", "joaovcampos@gmail.com", "joel.liendeborg.fredin@gmail.com", "joelperezurcelay@gmail.com", "joey.mccarthy1981@gmail.com", "johanbodin@gmail.com", "john.a.shaw3@gmail.com", "johnbarthelette@gmail.com", "johnderekmeyer@yahoo.com", "johneternal0@gmail.com", "johniris@buffalo.edu", "johnmchale2009@gmail.com", "johnsinclairfoley@gmail.com", "johnsonkristine617@gmail.com", "jon.allenby@me.com", "jonahkim429@hotmail.com", "jonathan.j.neris@gmail.com", "jonathanculver@gmail.com", "joncorbett1@outlook.com", "jonobelz@hotmail.com", "jonsweb@yahoo.com", "joohopark1@gmail.com", "jordan.scott.samuels@gmail.com", "jos@weesjes.com", "joseph@mangino.co", "josh.bogart@outlook.com", "josh.loh@gmail.com", "josh.r.johnson@gmail.com", "joshdobson_uni@live.com", "joshuab88@gmail.com", "josonjeffrey@qq.com", "jovanna.jiaying@gmail.com", "joychrismm@gmail.com", "jrapalje@gmail.com", "jrccc1112@gmail.com", "jrcormie@gmail.com", "jroy.treft@gmail.com", "jsvrcc1@googlemail.com", "jsw_uk@yahoo.com", "julia.pielas@hotmail.com", "juliapo@gmail.com", "julienvm@gmail.com", "julyenneamc@gmail.com", "junghayo17@gmail.com", "jungm565@comcast.net", "junpu2019@gmail.com", "justin.koegel@gmail.com", "justinlwatkins@gmail.com", "jwallen1992@hotmail.com", "jwhsu1000@gmail.com", "jwstein@gmail.com", "k.c.fraser@gmail.com", "k.lane5612@gmail.com", "k.sarah.y@gmail.com", "ka.avanesova@gmail.com", "kadeetaylor@gmail.com", "kaieckert@gmail.com", "kaitaro.toike@gmail.com", "kaiwen629@gmail.com", "kajal3014nov@gmail.com", "karina.k08.109@gmail.com", "kash.kj@gmail.com", "katerinarakelyan@gmail.com", "katherineortega1617@gmail.com", "kathrin.maike@gmail.com", "kathryn.suslov@gmail.com", "katiemmarquardt@gmail.com", "katihart@verizon.net", "katinayong@gmail.com", "katoen.jutamat@hotmail.com", "katsarski.andrey@gmail.com", "kawana.souichi@subaru.co.jp", "kayla.liao@cdischina.com", "kazijasim.kj@gmail.com", "kazimyildizhan@gmx.de", "kbas.social@gmail.com", "kcalkinskeyes@yahoo.com", "kelsey.miller1@gmail.com", "ken.clouser@cdischina.com", "ken.foo@protonmail.com", "kenbrec29@gmail.com", "kenichisatodesign@gmail.com", "kenmul2024@gmail.com", "kentchiou@hotmail.com", "kevin.fisher.uk@gmail.com", "kevinlau44@gmail.com", "kexiaoyun3@gmail.com", "kgilliss20@laposte.net", "khanazeem673@yahoo.com", "khanhtranquoc3003@gmail.com", "khinmyoswe5554@gmail.com", "kiananwyss@gmail.com", "kieran.jarrod@gmail.com", "kikicutze@gmail.com", "kim.birk@takealot.com", "kim.valeria93@gmail.com", "kim0880@hotmail.com", "kimchineserockstar@gmail.com", "kimmybatista@gmail.com", "kimvv2017@outlook.com", "kingcoolious@gmail.com", "kjaeuk@yahoo.ca", "kjell@kjellnelson.com", "kkpchan@hotmail.com", "knowlson_james@hotmail.com", "kohanyi@kohanyi.net", "konengalcala28@gmail.com", "kpesengco@yahoo.com", "krausjxotv@att.net", "kresten.peter.kirkelund@maersk.com", "kristina.krpk@gmail.com", "krumbacher@gmail.com", "ksenon.104@gmail.com", "ksluka@yandex.ru", "kswong@pobox.com", "kunaldaga@gmail.com", "kurtpfost@gmail.com", "kv.kristynavesela@gmail.com", "kvnhsun@gmail.com", "kyk4386a@naver.com", "labetskayae@gmail.com", "lade.adanijo@gmail.com", "laetitia.tran.ngoc@gmail.com", "laiw1997@gmail.com", "lalvaggos@gmail.com", "lan.caotn@gmail.com", "lance.lim@gmail.com", "langhua66@gmx.ch", "laobaixing@sonic.net", "lara_mcneill@hotmail.com", "larameshal1995@gmail.com", "larapanjkov@gmail.com", "larspasslick@gmail.com", "laura.begliatti@gmail.com", "lauren.collins@mso.umt.edu", "laurent.lehy@wanadoo.fr", "lawrence.lek@gmail.com", "lchan983@gmail.com", "leahabigalepickles@gmail.com", "leanhpho@gmail.com", "learnudemy101@gmail.com", "ledo7291@gmail.com", "leejk@ozemail.com.au", "leemelissa65@yahoo.com", "lehaquynh77@gmail.com", "lele49304@gmail.com", "lemailinbox@gmail.com", "lenkest@gmail.com", "leonmaximilianwitt@gmail.com", "leonormiguel2008@gmail.com", "levander.lasse@gmail.com", "lhdelange@yahoo.com", "liachanz.1205@gmail.com", "liefmuse@gmail.com", "lim.tonton@gmail.com", "liming8447@gmail.com", "lin.wolfin@gmail.com", "linda.kiekel@isqchina.com", "lindapost@zonnet.nl", "lindholm@protonmail.com", "linnam.j.lam@gmail.com", "linnea.a.moller@gmail.com", "lino_goncalves_roque@hotmail.com", "linshu1980@gmail.com", "liplovez@yandex.ru", "lisack@yahoo.com", "lise.skrodzki@gmail.com", "lissabankoley@gmail.com", "littlerockjim@gmail.com", "liverpool_rocks7@hotmail.com", "llance.grohprout@gmail.com", "lloydvictorrooza@outlook.com", "lmbjre8@aol.com", "lmendes88@yahoo.com", "lopezbenjjeremy@gmail.com", "lotharriedel@gmail.com", "lou.salome.883@gmail.com", "louis.amzprime@gmail.com", "lovelyday689@gmail.com", "loxcurran@gmail.com", "lpdsss@yahoo.com", "lswaffer@gmail.com", "luap11.paul@gmail.com", "lucia.prohnitchi@gmail.com", "lukas.murmann@gmail.com", "lukasmortenson@gmail.com", "luke@lukelombe.com", "lukeconner@gmail.com", "luod.roberto@live.it", "luongngockhanh6@gmail.com", "luuklentjes2002@gmail.com", "lyse.vanoverschelde@lyceefrancais.be", "m.hongkong@hotmail.com", "ma.richard@gmail.com", "mabeemer@gmail.com", "madelynn.rutan@gmail.com", "madspeterballe@gmail.com", "mag072813@gmail.com", "maggiethurber@gmail.com", "magnusberglund89@gmail.com", "mahendran.william@gmail.com", "mailrsp@yahoo.com", "maisbivolduarte@gmail.com", "majmitch@hotmail.com", "makarychevamaya@gmail.com", "manhlinhhce.15cfb02@gmail.com", "manishsri.82@gmail.clm", "mantaskleiba@gmail.com", "maqiuye81@hotmail.com", "marabuntah@gmail.com", "marandmaxx@yahoo.com", "marcconnolly1@outlook.com", "marcglindner@gmail.com", "marco.capra@mail.com", "marcvanderchijs@gmail.com", "margherita.montali@hotmail.com", "maria.wintererchinesepod@gmx.de", "mariazaborowska@gmail.com", "marina1peron@gmail.com", "marion.fougerouse@outlook.fr", "marionmezona@gmail.com", "marissa.marcolin@gmail.com", "maritzarobles024@gmail.com", "marjoriefranco51@gmail.com", "mark.e.jarvis.email@gmail.com", "marklogan1@live.co.uk", "marko.tulus@outlook.com", "markussogsts@gmail.com", "marlonsanches@yahoo.ca", "marps2006@gmail.com", "marshallforte11@augustana.edu", "marshallforte93@gmail.com", "martaondineatz@gmail.com", "martingarciason@gmail.com", "maschainbaclao@gmail.com", "masharassoha2004@gmail.com", "masisik.kum@gmail.com", "matserikgreger@yahoo.se", "matt-online@yahoo.com", "matt.janko@outlook.com", "matt.parrett@gmail.com", "matthew_reese27@yahoo.com", "matyasphilippe@yahoo.com", "max.t.hamilt@gmail.com", "me@lawrence.xyz", "meird2009@gmail.com", "melaniematteo@gmail.com", "melodyrune8@gmail.com", "melvinsurop@gmail.com", "menno.beem@gmail.com", "mensers@gmail.com", "meritenabs@gmail.com", "merryjos24@gmail.com", "mfairmer@aol.com", "mfronek@gmail.com", "michael.caraccio@gmail.com", "michael281573@hotmail.com", "michael@exled.co.uk", "michael@objectif.org", "michaelramer@outlook.com", "michelle.bishop@isqchina.com", "micmingo@tin.it", "miigaahsh@gmail.com", "mike@chinauktc.com", "mikemac40@hotmail.com", "mikeroj@gmail.com", "mikevella1@me.com", "milan.helebrandt@gmail.com", "mimmo0119@gmail.com", "mindywolfrom@gmail.com", "miranda_carr@hotmail.com", "mishmarcs@gmail.com", "mitch@home-pride.com", "mkrzykowski@cox.net", "mlaverriere221@gmail.com", "mmindling@gmail.com", "mnyls@rocketmail.com", "mochitang111@gmail.com", "mohamedsayedmasbero@gmail.com", "mohsensaifi1@gmail.com", "monicachungh@gmail.com", "moniekvandepeut@gmail.com", "montagnearnaud2@outlook.fr", "mor37rgr38@gmail.com", "morgancmav@yahoo.se", "moscow.shanghai@gmail.com", "mp.paydarfar@gmail.com", "mpsobczyk@hotmail.com", "mpunja@hotmail.com", "mr.sicardjulien@gmail.com", "mrtgltkn83@gmail.com", "ms.anneterry@me.com", "msjohns45@gmail.com", "muhdali764@gmail.com", "mungaya.irene@yahoo.com", "murray.cameron@xtra.co.nz", "mw195815@ohio.edu", "mw33699@gmail.com", "mwarres@gmail.com", "mwnorris89@gmail.com", "myohtikepol@gmail.com", "myrobmail@gmail.com", "mywwong@hotmail.com", "naciyekubra1@gmail.com", "naimul.chowdhury15@ncf.edu", "nancyyu@alumni.duke.edu", "nantana86@gmail.com", "naotakayamada1988@gmail.com", "nataliasmice07@gmail.com", "naturefarm.na@gmail.com", "nazebra@mail.ru", "neisenberkeley@gmail.com", "nereagl27@gmail.com", "nettme@gmail.com", "nezamakaelah@gmali.com", "ngdanghan@gmail.com", "ngearhart@gmail.com", "nguk.ng@gmail.com", "nguyenlanganhduong@gmail.com", "nguyenviethai819996@gmail.com", "nguyenxuanbaovt@gmail.com", "nhills@comcast.net", "nhuquynhpika@gmail.com", "niamh.lawson36@gmail.com", "nick.a.copeland@gmail.com", "nickjcarr88@gmail.com", "niklas.lindholm@outlook.com", "niklasrossol@gmail.com", "niku719@gmail.com", "nils.naumann@icloud.com", "nilsweyer@gmail.com", "nisanuryar17@gmail.com", "nizam.ansary82@gmail.com", "nminogue@bigpond.net.au", "nnamdijr@gmail.com", "nouraldinwalid@gmail.com", "nperrotte@fastmail.fm", "ntoddsmit@gmail.com", "ntruong2066@gmail.com", "nua.anan@gmail.com", "nurtha22@gmail.com", "nward@clairbourn.org", "o.jankauskaites@gmail.com", "obitappers@googlemail.com", "odomhnc@tcd.ie", "odunghat@gmail.com", "ogoroda@mail.ru", "ogurtsovazhenia@gmail.com", "ojuliad@yandex.ru", "okaforblessing403@gmail.com", "ol.v.t.29@gmail.com", "oli.larouche@gmail.com", "oliverajarvis@gmail.com", "oliverally3@gmail.com", "opc1@telefonica.net", "opticalgoods@gmail.com", "ora.et.labora827@gmail.com", "orrichardson@zynga.com", "osa.com@me.com", "osamudisaac@gmail.com", "ositelina7@gmail.com", "oskar.sulowski@googlemail.com", "osoderusia@mail.ru", "owainj13@gmail.com", "ozguorui@hotmail.com", "pablodzgo@gmail.com", "pallaras@gmail.com", "pascalleliu@yahoo.com", "pashahat1@gmail.com", "pasteur.tran@gmail.com", "patrickfrick@icloud.com", "patrizia83@gmail.com", "patriziodefeudis@gmail.com", "paul.walkinshaw@gmail.com", "paul_le@comcast.net", "paulo_in_china@yahoo.com.br", "pavel.kirchanov@gmail.com", "pbigelowslc@mac.com", "pchang360@gmail.com", "pedroc11@gmail.com", "pefendee@gmail.com", "peng142@gmail.com", "pepper.jc@gmail.com", "perebinosal@yandex.ru", "period8yoga@sonic.net", "pernilleson@gmail.com", "perusareamazon@gmail.com", "perwagnernielsen@gmail.com", "pescullin@hotmail.com", "peter.hugh@outlook.com", "petersamet@gmail.com", "petrus@wang.se", "pey.jean.tan@icloud.com", "pgandcurt@comcast.net", "phonocrazy@gmail.com", "photomatix@gmail.com", "pillsomrith4@gmail.com", "piotr.wojda@pwstudio.eu", "plauche@ciclsu.com", "plennon@maine.rr.com", "pmcbride16@hotmail.com", "pmijden73@gmail.com", "pmulhall@gmail.com", "pogimaniulit021@gmail.com", "poopoopeepee@gmail.com", "post@arne-mueller.de", "potkonenpeppi@gmail.com", "ppsiverek80@gmail.com", "prahadeesh.b@gmail.com", "pratiban.parthiban@gmail.com", "precht.denise@gmail.com", "pressinck@gmail.com", "priscilla.w.guo@gmail.com", "prominens7@mail.ru", "pwi@live.fr", "pyochen780@gmail.com", "qhairunisha.17@gmail.com", "qinmingxingruby@126.com", "qqqwwwqw32@gmail.com", "quachtoanlong@gmail.com", "quang.hai.le@gmail.com", "quique123@yahoo.com", "r.alexandre.wendell@gmail.com", "raalhabshan@gmail.con", "rabiafyz87@gmail.com", "rachel_short@gb.smbcgroup.com", "racheltr82@yahoo.com", "radek73@me.com", "raluca.x.popa@gmail.com", "ramji.srinivasan@gmail.com", "raquel.sanchez120406@icloud.com", "ratapuina@gmail.com", "raviv73@gmail.com", "rbcaul@yahoo.com.au", "realglenn7@gmail.com", "realzachsmith@gmail.com", "reblackwell3@gmail.com", "rebull@outlook.com", "reem.althawadi@outlook.com", "reem_mo7_kamel@hotmail.com", "reflectionperspection@gmail.com", "regiendebleecker@yahoo.com", "remziyedmr463@gmail.com", "rensburghardt@gmail.com", "rhena_bungag14@yahoo.com", "rhoang36@gmail.com", "ria.oneday@icloud.com", "ricardotelesmelo@gmail.com", "richard.moessner@googlemail.com", "richard.wells.iii@gmail.com", "richardhong2014@gmail.com", "richieslack@gmail.com", "rie.shimosugi@gmail.com", "rigan30102006@gmail.com", "rightnow931@yahoo.com", "rika16888@gmail.com", "rikkilala@hotmail.com", "risto.salmio@iki.fi", "riverabjr6@gmail.com", "rjellison@huskers.unl.edu", "rji68@protonmail.com", "rjparson@princeton.edu", "robchunwong@gmail.com", "robmmichaels@gmail.com", "robobole@yahoo.com", "robynbrodiegrant@gmail.com", "rockjana@gmail.com", "rocko.texas@gmail.com", "rogerm@myself.com", "rogerrandle185@hotmail.com", "roman.jud@gmx.ch", "ronsare.truong@gmail.com", "roopak@the120mediacollective.com", "rorybatewilliams@hotmail.com", "roselynzapata@chinesepod.com", "rosinisarti@alice.it", "ross.wilken@gmail.com", "rpratt@sina.com", "rran@mailcity.com", "rslack52@yahoo.com", "rturo.oropeza@gmail.com", "rubmg8@gmail.com", "ruffalomb@gmail.com", "rurichan16@gmail.com", "russ.polson@yahoo.com", "russlodge@gmail.com", "ruthgotthelf@hotmail.com", "ryan.devries27@gmail.com", "ryanramos7@gmail.com", "ryue1231@gmail.com", "s.education@levett.biz", "s.parsai@yahoo.com", "s4073255@gmail.com", "sadeghimarya@yahoo.com", "sam-musica@hotmail.com", "samparrtwin2@gmail.com", "samuelmugford@gmail.com", "samyoual@outlook.com", "sara.tidman206@sccdsb.net", "sarabertoli05@gmail.com", "saraheewonsuh@gmail.com", "sarahelizabethadams@gmail.com", "sarahelizday@gmail.com", "saxyrobert@aol.com", "schighers@gmail.com", "schulterblatt92@hotmail.com", "scott.kane@isqchina.com", "scotto858@yahoo.com", "sebastienbrady@gmail.com", "selinah12@gmail.com", "sellasegameli@gmail.com", "sergeigertz@gmail.com", "sergienkodan00@mail.ru", "sezell@gmail.com", "shaab11@rocketmail.com", "she1733@gmail.com", "shelagh.mahbubani@gmail.com", "shelleynania@gmail.com", "shhc0525@hanafos.com", "sholicova@yahoo.ca", "shradhabisht76@gmail.com", "siddharthbharatpurohit@gmail.com", "sidneynaak@gmail.com", "silviamazzucco@gmail.com", "simailanasir3@gmail.com", "simon.higginson@britishcouncil.org", "simon.mckenna@gmail.com", "simon.wong2500@gmail.com", "simoncdalton@gmail.com", "simonegli88@gmail.com", "simonyan_maryana@mail.ru", "simpaol@email.it", "since1984@gmail.com", "siret28@gmail.com", "sisterwood@gmail.com", "sj930389@gmail.com", "sja6791@gmail.com", "sjhunter86@gmail.com", "skullerhead@gmail.com", "skyyexin@gmail.com", "slouey1@yahoo.com", "smilingshirley@gmail.com", "smw525@nyu.edu", "sn.prachaniwet@gmail.com", "sneakythepirate12@gmail.com", "snith@gmail.com", "sofiah2o28@gmail.com", "sofiamatos88@gmail.com", "sofiekindholm@hotmail.com", "sofisoficir@hotmail.it", "soklyphon1994@gmail.com", "solner90@gmail.com", "sophie@chinesepod.com", "sourovm33@gmail.com", "sovandara1996@gmail.com", "sowking97@gmail.com", "sprontz@hotmail.com", "spuente@ucdavis.edu", "stavgn@gmail.com", "stellanaba@hotmail.co.id", "stephen.a.guthrie@gmail.com", "stephendisalvio@protonmail.com", "stephenminas@mac.com", "steve.snellenberger@gmail.com", "steven_e_liauw@yahoo.com", "stillonstill78@yahoo.fr", "stokielx@mlc.vic.edu.au", "streetupdates.com@gmail.com", "stuart203@hotmail.com", "studiomelonisas@gmail.com", "sukanin.lert@gmail.com", "supin.p.chen@gmail.com", "supreethas89@gmail.com", "sushkovaes@gmail.com", "susurro2u2@yahoo.com", "svenschmidt82@gmail.com", "sweetheartlay22@gmail.com", "sweiz@rcn.com", "syismeoks@hotmail.com", "sylwianow@yahoo.com", "sylyixiao@163.com", "syninaptic2@gmail.com", "szesez@gmail.com", "taehjin.a53@gmail.com", "taisuke@dream.email.ne.jp", "talfishman@gmail.com", "taliyah9110@gmail.com", "talonhogue562@gmail.com", "tamlde@live.fr", "tamnhi2000@gmail.com", "tamyd20032002@gmail.com", "tarin.eccleston@gmail.com", "tariqha@gmail.com", "tascho14@g.holycross.edu", "tch399@gmail.com", "telmuun.oyunzul@gmail.com", "tereaportee@gmail.com", "terraymet@gmail.com", "th-kniest@bluewin.ch", "thanhhien095@gmail.com", "thao511@gmail.com", "thehobomanman@gmail.com", "thelacostik@hotmail.com", "thelearnerscoach@gmail.com", "themastertherion@gmail.com", "theopistiy@gmail.com", "thidaseng221220@gmail.com", "thomas.denhoff.ball@gmail.com", "thomas.jankovsky@gmail.com", "thomas.r.lewicki@gmail.com", "thomasjkearneyjr@gmail.com", "thomaspreuss@web.de", "thowky@gmail.com", "tianosiakerejolaeminefo@gmail.com", "tigrouxz@hotmail.com", "tim.tetzlaff85@gmail.com", "timisnesvarbu@gmail.com", "timothyjamesbourne@gmail.com", "timothypage@hotmail.com", "timschutt711@gmail.com", "tjames6432@gmail.com", "tjbrennan100@gmail.com", "tlkk2m@gmail.com", "tmunson@sc.rr.com", "tobias.wikerholmen@hotmail.no", "toianw@yahoo.co.uk", "tom.burn@gmail.com", "tomas.krejci94@gmail.com", "tomdepew@icloud.com", "tomes@nccn.net", "tompoloz@wp.pl", "tony.dodd@btinternet.com", "tony.meadows@lee-dickens.co.uk", "tony160411@gmail.com", "tonybranigan145@gmail.com", "toph85@live.com.au", "torsten888@gmail.com", "tp@egaa-gym.dk", "tphagan@gmail.com", "tracey-lee.walker@hotmail.com", "tranhuyudv@gmail.com", "trannguyen0702@gmail.com", "travispierce@hotmail.com", "triciachwu@gmail.com", "tsessebe@gmail.com", "tsgrant01@gmail.com", "tsmithov@yahoo.com", "tunnelbreeze@gmail.com", "tuomas.puoskari@gmail.com", "turlochmooney@yahoo.com", "turonb@gmail.com", "txotxo.films@gmail.com", "tylerhennings@hotmail.com", "typeter1@gmail.com", "u.m.baptist@gmail.com", "uberferg5768@gmail.com", "ubteoman@gmail.com", "ucparente@gmail.com", "uinden@t-online.de", "ultimateyang@gmail.com", "upoma_gourab@hotmail.com", "vaderalam@gmail.com", "valenciaevert643@gmail.com", "valentinaceriani90@gmail.com", "valentine.bidault@outlook.fr", "vanderlei.basei@hotmail.com", "vanduy11t2@gmail.com", "vania.aprilina@gmail.com", "vary.eremenko@gmail.com", "varzinskaitegabija@gmail.com", "vetykaterin@yahoo.com", "vicchao@gmail.com", "victoria.hammarstrand@gmail.com", "victorlopezalmeria@hotmail.com", "vigor.simple1990@gmail.com", "viktor_yordanov1@abv.bg", "vill_cm@yahoo.com", "vips1012@gmail.com", "vivax0123@gmail.com", "vnct46@gmail.com", "volejnik.ondra@gmail.com", "volkov.mail@gmail.com", "vulinhh1996@gmail.com", "vutr.nguyen@gmail.com", "walid.shaari@gmail.com", "wanou.achat@mac.com", "watersrick@yahoo.com", "watsonduskfang@gmail.com", "wdefrank@yahoo.com", "wendell2003@adelphia.net", "wernerandrew@gmail.com", "westemp@web.de", "wfritz94@gmail.com", "wheninasia@outlook.com", "whittenburydaniel@gmail.com", "wibbet@gmail.com", "wieteke_erkens@hotmail.com", "will.e.bennett@gmail.com", "will.lehman@gmail.com", "wjeaton@hotmail.com", "wmaxsen@yahoo.com", "wohnung-hbg@gmx.de", "wolfgang.geise@googlemail.com", "woodworker@iname.com", "wsphipps@gmail.com", "wuller1@gmail.com", "wvalse@gmail.com", "wwolff12000@yahoo.com", "wyness2009@gmail.com", "xiaojiewxj@outlook.com", "xiaomiyisheng@gmail.com", "xmlgpingu@gmail.com", "xoltd2001@yahoo.com.hk", "xristi4irina@yandex.ru", "xroker@gmail.com", "yakasamt@gmail.com", "yanalbuk@gmail.com", "yandel@yandex.ru", "yann_bourgeois@hotmail.com", "yasmin.lindholm@hotmail.com", "ybarabash@yahoo.com", "yk_sunaga@yahoo.com", "yolanda.sastra@gmail.com", "yoni.asie@gmail.com", "you.integration@gmail.com", "yusufnurabukar@gmail.com", "yvonne.lee23@gmail.com", "zahranaseri42@yahoo.com", "zbrian8510@gmail.com", "zheni.karakousis@btinternet.com", "zhongbinghui1995@gmail.com", "zhujessica806@gmail.com", "zitzelsberger.florian@gmail.com", "zlobina.anna.ch.eng@gmail.com", "zoll-patrick@bluewin.ch", "zorz66@hotmail.com", "zp022730@sdale.org", "zskye@outlook.com"]

    let userData = await sails.models['user'].find({email: {in: liveUsers}, id: {nin: emailList}, confirm_status: 1});

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
      target.campaignName = `Inactive Users - ${target.name} - ${currentDate.toLocaleString('default', { month: 'long' })}`;

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

