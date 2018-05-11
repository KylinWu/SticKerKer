const telegram = require('./init')

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
    .then(console.log)
    .catch(console.log);
}

module.exports = { sendMsg, getForeignPeer };
