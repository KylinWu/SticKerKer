const login = require('./login');
const { getForeignPeer, sendMsg } = require('./sendMsg');

function MTProto () {
}

MTProto.prototype.login = login;
MTProto.prototype.sendMsg = sendMsg;
MTProto.prototype.getForeignPeer = getForeignPeer;

module.exports = MTProto;
