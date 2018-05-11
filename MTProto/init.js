const MTProto = require("telegram-mtproto").MTProto;
require('dotenv').config({path: __dirname + '/../.env'});

const api = {
      invokeWithLayer: 0xda9b0d0d,
      layer          : 57,
      initConnection : 0x69796de9,
      api_id         : Number(process.env.MTPROTO_API_ID),
      app_version    : '1.0.1',
      lang_code      : 'en'
}

const server = { webogram: false, dev: true }

const telegram = MTProto({ api, server })

module.exports = telegram
