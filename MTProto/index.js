const login = require('./login');
const { getForeignPeer, getLastMsg, sendMsg, sendMedia, sendFilePart } = require('./sendMsg');

function MTProto () {
}

MTProto.prototype.login = login;
MTProto.prototype.sendMsg = sendMsg;
MTProto.prototype.sendMedia = sendMedia;
MTProto.prototype.sendFilePart = sendFilePart;
MTProto.prototype.getForeignPeer = getForeignPeer;
MTProto.prototype.getLastMsg = getLastMsg;

module.exports = MTProto;
