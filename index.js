require('dotenv').config({path: __dirname + '/.env'});
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
const Handler = require('./Bot');
const handler = new Handler();

const userChatId = process.env.TELEGRAM_USER_CHAT_ID;

const parse = async msg => {
    console.log(msg);
    var match;
    const helpReg = /\/start|\/help/;
    const cancelReg = /\/cancel/;
    const newpackReg = /\/newpack ([0-9]{1,7})/;
    const quickpackReg = /\[(.+)\]\nhttps:\/\/line.me\/S\/sticker\/([0-9]{1,7})/;
    if (await helpReg.test(msg)) {
        return { 
            cmd:'help' 
        };
    }
    else if (await cancelReg.test(msg)) {
        return { 
            cmd: 'cancel' 
        };
    }
    else if (await newpackReg.test(msg)) {
        match = await newpackReg.exec(msg);
        return {
            cmd: 'newpack',
            stickerID: Number(match[1])
        };
    }
    else if (await quickpackReg.test(msg)) {
        match = await quickpackReg.exec(msg);
        return {
            cmd: 'quickpack',
            packName: match[1].toString(),
            stickerID: Number(match[2])
        }
    }
    else {
        return {
            cmd: 'input'
        }
    }
}

const run = async () => {
    await handler.init();
    bot.onText(/[^]+/, async(msg, match) => {
        const chatId = msg.chat.id;
        const input = match[0];
        if (chatId == userChatId) {
            var result = await parse(input);
            switch (result.cmd) {
                case 'help':
                    handler.help(bot, chatId);
                    break;
                case 'cancel':
                    handler.cancel(bot, chatId);
                    break;
                case 'newpack':
                    handler.newpack(bot, chatId, result.stickerID);
                    break;
                case 'quickpack':
                    handler.quickpack(bot, chatId, result.stickerID, result.packName);
                    break;
                case 'input':
                    handler.input(bot, chatId, input);
                    break;
            }
        }
        else {
            bot.sendMessage(chatId, 'You are not my lord.');
        }
    });
    
};

run();
