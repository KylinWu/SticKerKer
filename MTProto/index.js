const login = require('./login');
const { getForeignPeer, sendMsg, sendMedia } = require('./sendMsg');

function MTProto () {
}

MTProto.prototype.login = login;
MTProto.prototype.sendMsg = sendMsg;
MTProto.prototype.sendMedia = sendMedia;
MTProto.prototype.getForeignPeer = getForeignPeer;

module.exports = MTProto;
