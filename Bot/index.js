const { init, help, cancel, newpack, input } = require('./handler')

function Handler() {
};

Handler.prototype.init = init;
Handler.prototype.help = help;
Handler.prototype.cancel = cancel;
Handler.prototype.newpack = newpack;
Handler.prototype.input = input;

module.exports = Handler;
