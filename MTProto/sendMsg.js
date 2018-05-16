const telegram = require('./init');
const fs = require('mz/fs');
const crypto = require('crypto');
const path = require('path');

function nextRandomInt (maxValue) {
    return Math.floor(Math.random() * maxValue)
}

async function getLastMsg(peer) {
    return await telegram('messages.getPeerDialogs', {
        peers: [{
            _: 'inputPeerUser',
            user_id: peer.user_id,
            access_hash: peer.access_hash
        }]
    })
    .then(result => {
        return result.messages[0].message;
    })
    .catch(console.log);
}

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

async function sendFilePart(peer, file) {
    const _256k = 256 * 1024;
    let bytes;
    await fs.readFile(file).then(data => {
        bytes = data;
    })
    .catch(console.log);
    const fileId = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)];
    const parts = Math.ceil(bytes.length/_256k);
    var start = 0, end;
    for (var i=0; i<parts; i++) {
        end = start + _256k;
        if (end > bytes.length) {
            end = bytes.length;
        }
        await telegram('upload.saveFilePart', {
            file_id: fileId,
            file_part: i,
            bytes: bytes.slice(start, end)
        })
        .then()
        .catch(console.log);
        start = end;
    }
    return {
        file: file,
        fileId: fileId,
    };
}

async function sendMedia(peer, file, fileId) {
    const _256k = 256 * 1024;
    let parts;
    let md5_hash;
    await fs.readFile(file).then(async (data) => {
        parts = await Math.ceil(data.length/_256k);
        md5_hash = await crypto.createHash('md5').update(data).digest('hex');
    })

    telegram('messages.sendMedia', {
        peer: {
            _: 'inputPeerUser',
            user_id: peer.user_id,
            access_hash: peer.access_hash
        },
        media: {
            _: 'inputMediaUploadedDocument',
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
        random_id: [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)]
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
        random_id: [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)]
    })
    .then(console.log('Send Message :' + message))
    .catch(console.log);
}

module.exports = { sendMsg, sendFilePart, sendMedia, getForeignPeer, getLastMsg };
