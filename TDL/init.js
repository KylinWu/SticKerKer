const { Client } = require('tdl')
require('dotenv').config({path: __dirname + '/../.env'});

const config = {
    id  : process.env.MTPROTO_API_ID,
    hash: process.env.MTPROTO_API_HASH,
}

const option = {
    apiId: Number(config.id),
    apiHash: config.hash.toString(),
    verbosityLevel: 2,
    dev: false,
    binaryPath:  __dirname + '/libtdjson',
    databaseDirectory:  __dirname + '/_td_database',
    filesDirectory:  __dirname + '/_td_files',
    tdlibParameters: {
        use_message_database: false
    }
}

const telegram = new Client(option);

module.exports = telegram
