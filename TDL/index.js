const auth = require('./auth');
const { sendMsg, sendFile, getChatId, getChat, getLastMsg } = require('./query');

function TD () {
}

TD.prototype.auth = auth;
TD.prototype.sendMsg = sendMsg;
TD.prototype.getChatId = getChatId;
TD.prototype.sendFile = sendFile;
TD.prototype.getLastMsg = getLastMsg;
module.exports = TD;
