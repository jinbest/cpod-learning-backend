module.exports = {


  friendlyName: 'Clean course',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    const fs = require('fs');

    let lessonIds = await new Promise(resolve => {
      fs.readdir('lib/replacement-thumbnails/', function (err, files) {
        if (err) {
          return sails.log.error(err)
        }
        resolve(files.map(file => file.split('.')[0]));
      });
    })

    if(!lessonIds) {
      return
    }

    let lessonList = await LessonData.find({id: {in: lessonIds}});

    for (let i = 0; i < lessonList.length; i++) {
      let lesson = lessonList[i];

      let thumbnail; let dirName; let thumbnailName;
      let filename = lesson.id.toString().toUpperCase() + '.1280.1778.jpg'

      try {
        thumbnail = fs.createReadStream('lib/replacement-thumbnails/' + filename);
        thumbnailName = lesson.image.split('images/')[1].replace('.png', '.jpg')
      } catch (e) {
      }

      try {
        dirName = `${lesson.type === 'extra' ? 'extra/' : ''}${lesson.id}/${lesson.hash_code}/images`
      } catch (e) {
      }

      if (!thumbnail || !dirName || !thumbnailName) {
        return {
          thumbnail: thumbnail,
          dirName: dirName,
          thumbnailName: thumbnailName
        }
      }

      let options =
        {
          key: sails.config.custom.awsKey
          , secret: sails.config.custom.awsSecret
          , bucket: 'chinesepod.com'
          , region: 'us-east-1'
          , dirname: dirName
          , ACL: 'public-read',
          headers: {
            'x-amz-acl': 'public-read'
          },
          s3params: {ACL: 'public-read'},
        };

      const adapter = require('skipper-better-s3')(options)

      const receiver = adapter.receive({
        dirname: dirName
        , ACL: 'public-read',
        headers: {
          'x-amz-acl': 'public-read'
        },
        s3params: {
          ACL: 'public-read',
          Key: dirName + '/' + thumbnailName
        },
      })

      await new Promise((resolve) => {
        receiver.write(thumbnail, async () => {
          await LessonData.updateOne({id: lesson.id})
            .set({image: thumbnail.extra.Location.replace(
                'https://s3.amazonaws.com/chinesepod.com/',
                'https://s3contents.chinesepod.com/')
            });
          console.log(thumbnail.extra.Location);
          resolve()
        })
      });

    }

  }


};

