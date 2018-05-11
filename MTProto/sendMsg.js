const telegram = require('./init');
const fs = require('mz/fs');
const crypto = require('crypto');
const path = require('path');

async function getForeignPeer(username) {
    
    return await telegram('contacts.search', {
        "q": username,
        "limit": 1
    })
    .then(result => {
        for(var i=0; i < result.users.length; i++) {
            if (result.users[i].id === 429000) {
                return {
                    user_id: result.users[i].id,
                    access_hash: result.users[i].access_hash
                };
            }
        }
    })
    .catch(console.log);
}

async function sendMedia(peer, file) {
    const _512k = 512 * 1024;
    let bytes;
    let md5_hash;
    await fs.readFile(file).then(data => {
        bytes = data;
    })
    .catch(console.log);
    md5_hash = await crypto.createHash('md5').update(bytes).digest('hex');
    const fileId = Math.random() * 10e7 >> 0;
    const parts = Math.ceil(bytes.length/_512k);
    var start = 0, end;
    for (var i=0; i<parts; i++) {
        end = start + _512k;
        if (end > bytes.length) {
            end = bytes.length;
        }
        await telegram('upload.saveFilePart',  {
            file_id: fileId,
            file_part: i,
            bytes: bytes.slice(start, end)
        })
        .then()
        .catch(console.log);
        start = end;
    }

    await telegram('messages.sendMedia', {
        peer: {
            _: 'inputPeerUser',
            user_id: peer.user_id,
            access_hash: peer.access_hash
        },
        media: {
            _: 'inputMediaUploadedDocument',
            flags: 0,
            file: {
                _: 'inputFile',
                id: fileId,
                parts: parts,
                name: file,
                md5_checksum: md5_hash
            },
            mime_type: 'image/png',
            attributes: [{
                _: 'documentAttributeFilename',
                file_name: path.basename(file, '.png')
            }],
        },
        random_id: Math.random() * 10e7 >> 0
    })
    .then(console.log('Send stick : ' + path.basename(file)))
    .catch(console.log);
}

async function sendMsg(peer, message) {
    await telegram('messages.sendMessage', {
        peer: {
            _: 'inputPeerUser',
            user_id: peer.user_id,
            access_hash: peer.access_hash
        },
        message: message,
        random_id: Math.random() * 10e7 >> 0
    })
    .then(console.log('Send Message :' + message))
    .catch(console.log);
}

module.exports = { sendMsg, sendMedia, getForeignPeer };
