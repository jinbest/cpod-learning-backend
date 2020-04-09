module.exports = {


  friendlyName: 'Android app',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let addIDs = sails.config.custom.prerollAndroidURLs;

    let addURL = addIDs[Math.floor(Math.random() * addIDs.length)];

    if (sails.config.environment === 'development') {
      await sails.helpers.logs.createEvent({
        'userId': this.req.session.userId ? this.req.session.userId : 'NONE',
        'email': this.req.me ? this.req.me.email : 'NONE',
        'sessionId': this.req.session.id,
        'access_ip': this.req.ip,
        'action': 'show_mobile_preroll_ad',
        'event_category': 'advertising',
        'event_label': `Play Mobile Preroll Ad ${addURL}`,
        'timestamp': new Date()
      });
    } else {

      userInfoQueue.add('LogEvent', {
        'userId': this.req.session.userId ? this.req.session.userId : 'NONE',
        'email': this.req.me ? this.req.me.email : 'NONE',
        'sessionId': this.req.session.id,
        'access_ip': this.req.ip,
        'action': 'show_mobile_preroll_ad',
        'event_category': 'advertising',
        'event_label': `Play Mobile Preroll Ad ${addURL}`,
        'timestamp': new Date()
      },{
        attempts: 3,
        timeout: 60000
      })

    }

    const adObject = `<VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
    <Ad id="6972004961">
        <InLine>
            <AdSystem>GDFP</AdSystem>
            <AdTitle/>
            <Description>
            </Description>
            <Creatives>
                <Creative id="578604590561" sequence="1">
                    <Linear skipoffset="00:00:05">
                        <Duration>00:00:15</Duration>
                        <MediaFiles>
                            <MediaFile id="GDFP" delivery="progressive" width="1280" height="720" type="video/mp4" bitrate="533" scalable="true" maintainAspectRatio="true">
                                <![CDATA[${addURL}]]>
                            </MediaFile>
                        </MediaFiles>
                    </Linear>
                </Creative>
            </Creatives>
        </InLine>
    </Ad>
</VAST>`;

    this.res.set({'Content-Type': 'application/xml'}).send(adObject)

  }


};
