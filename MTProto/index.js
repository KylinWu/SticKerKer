const login = require('./login');
const auth = require('./auth');
const { getForeignPeer, getLastMsg, sendMsg, sendMedia, sendFilePart } = require('./sendMsg');

function MTProto () {
}

MTProto.prototype.login = login;
MTProto.prototype.auth = auth;
MTProto.prototype.sendMsg = sendMsg;
MTProto.prototype.sendMedia = sendMedia;
MTProto.prototype.sendFilePart = sendFilePart;
MTProto.prototype.getForeignPeer = getForeignPeer;
MTProto.prototype.getLastMsg = getLastMsg;

module.exports = MTProto;
