module.exports = {


  friendlyName: 'Android app',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: function (inputs) {


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
                        <Duration>00:03:06</Duration>
                        <MediaFiles>
                            <MediaFile id="GDFP" delivery="progressive" width="1280" height="720" type="video/mp4" bitrate="533" scalable="true" maintainAspectRatio="true">
                                <![CDATA[http://embed.wistia.com/deliveries/ad2c327bb68922ccec498c30db33cc6c302135f4.bin/videoAD.mp4]]>
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
