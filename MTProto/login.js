const telegram = require('./init')
require('dotenv').config({path: __dirname + '/../.env'});

const { inputField } = require('./fixtures')

const config = {
    // NOTE: if you FORK the project you MUST use your APP ID.
    // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
    // You can obtain your own APP ID for your application here: https://my.telegram.org
    id  : process.env.MTPROTO_API_ID,
    hash: process.env.MTPROTO_API_HASH
}

const login = async () => {
    try {
        const phone = await inputField('phone')
        console.log(phone)
        const { phone_code_hash } = await telegram('auth.sendCode', {
                phone_number  : phone,
                current_number: false,
                api_id        : config.id,
                api_hash      : config.hash
        })
        const code = await inputField('code')
        const res = await telegram('auth.signIn', {
            phone_number: phone,
            phone_code_hash,
            phone_code  : code
        })
        const { user } = res
        const {
            first_name = '',
            username = ''
        } = user
        console.log('signIn', first_name, username, user.phone)
        return first_name
    } catch (error) {
        console.error(error)
    }
}

module.exports = login
