module.exports = {


  friendlyName: 'Hash Password',


  description: 'Hash password according to existing ChinesePod Standards',

  inputs: {

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    },

    method: {
      description: 'Encrypt or Decrypt method - E or D',
      example: 'E',
      type: 'string',
      defaultsTo: 'E'
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Password Hashed',
      outputDescription: 'Return a hashed password',
    }

  },


  fn: async function(inputs) {
    let Md5 = require("crypto-js/md5");
    let base64 = require("crypto-js/enc-base64");

    let key = 'sgsd!aadsf6699#dsf;,asdga!6fffkogasdfppyhhav6';
    key = Md5(key);
    let keyLength = key.toString().length;
    let string = inputs.methdod === 'D'
      ? base64.parse(inputs.password)
      : Md5(inputs.password + key).toString().substr(0, 8) + inputs.password;
    const stringLength = string.length;
    let result = '';
    let rndkey = [];
    let box = [];
    for (let i = 0; i <= 255; i++) {
      rndkey[i] = (key.toString())[i % keyLength].charCodeAt(0);
      box[i]    = i;
    }
    for (let i = 0, j = 0, tmp = 0; i < 256; i++) {
      j = (j + box[i] + rndkey[i]) % 256;
      tmp = box[i];
      box[i] = box[j];
      box[j] = tmp;
    }
    for (let i = 0, a = 0, j = 0, tmp = 0; i < stringLength; i++) {
      a = (a + 1) % 256;
      j = (j + box[a]) % 256;
      tmp = box[a];
      box[a] = box[j];
      box[j] = tmp;
      result  += (String.fromCharCode(string[i].charCodeAt(0) ^ (box[(box[a] + box[j]) % 256])));
    }
    return Buffer.from(result, 'binary').toString('base64').replace(new RegExp('=','g'),'');
  }
};
