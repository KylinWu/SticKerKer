const telegram = require('./init');

const auth = async () => {
    return await telegram.connect();
}

module.exports = auth
