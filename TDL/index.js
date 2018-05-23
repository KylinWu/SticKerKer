const auth = require('./auth');
const { sendMsg, sendFile, getChatId, getChat, getLastMsg, muteChat, unmuteChat } = require('./query');

function TD () {
}

TD.prototype.auth = auth;
TD.prototype.sendMsg = sendMsg;
TD.prototype.getChatId = getChatId;
TD.prototype.sendFile = sendFile;
TD.prototype.getLastMsg = getLastMsg;
TD.prototype.muteChat = muteChat;
TD.prototype.unmuteChat = unmuteChat;
module.exports = TD;
