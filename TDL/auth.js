const telegram = require('./init');
require('dotenv').config({path: __dirname + '/../.env'});

const config = {
    phone: process.env.PHONE
}

const loginDetails = {
    phoneNumber: config.phone.toString(),
};

const auth = async () => {
    await telegram.connect();
    return await telegram.login(() => (loginDetails));
}

module.exports = auth
