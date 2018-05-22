const { init, help, cancel, newpack, quickpack, input } = require('./handler')

function Handler() {
};

Handler.prototype.init = init;
Handler.prototype.help = help;
Handler.prototype.cancel = cancel;
Handler.prototype.newpack = newpack;
Handler.prototype.quickpack = quickpack;
Handler.prototype.input = input;

module.exports = Handler;
