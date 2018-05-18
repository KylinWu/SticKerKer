const { Storage } = require('mtproto-storage-fs');
const MTProto = require("telegram-mtproto").MTProto;
require('dotenv').config({path: __dirname + '/../.env'});

storagePath = ('./storage.json');

const api = {
      invokeWithLayer: 0xda9b0d0d,
      layer          : 57,
      initConnection : 0x69796de9,
      api_id         : Number(process.env.MTPROTO_API_ID),
      app_version    : '1.0.1',
      lang_code      : 'en'
}

const app = {
    storage: new Storage(storagePath)
}

const server = { webogram: false, dev: true }

const telegram = MTProto({ api, server, app })

module.exports = telegram
