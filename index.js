require('dotenv').config({path: __dirname + '/.env'});
const TelegramBot = require('node-telegram-bot-api');
const MTProto = require('./MTProto');
const API = require('./API');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
const mtproto = new MTProto();
const api = new API();

const fs = require('mz/fs');
const path = require('path');
const emoji = require('node-emoji');

const userId = process.env.TELEGRAM_USERID;

const Stage = {
    "Idle": 0,
    "Downloading": 1,
    "WaitPackName": 2,
    "Uploading":3,
    "WaitShortName": 4
}
Object.freeze(Stage);
var currentStage = Stage.Idle;

const helpMsg = 
    `/newpack StickerPackID - create a new sticker pack\n` + 
    `/cancel - cancel the current operation`;

async function run() {
    await mtproto.login();
    const peer = await mtproto.getForeignPeer('@Stickers');
    bot.onText(/\/start/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (chatId == userId) {
           await bot.sendMessage(chatId, helpMsg);
        }
    });

    bot.onText(/\/help/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (chatId == userId) {
            await bot.sendMessage(chatId, helpMsg);
        }
    });

    bot.onText(/\/newpack ([0-9]{7})/, async (msg, match) => {
        //Only responses my chat by id
        const chatId = msg.chat.id;
        const stickerID = match[1];

        if (chatId == userId && currentStage == Stage.Idle) {
            await bot.sendMessage(chatId, 'Start downloading Line sticker pack ' + stickerID);
            currentStage = Stage.Downloading;
            await api.download(stickerID);
            await bot.sendMessage(chatId, 'Please give a name for your pack.');
            currentStage = Stage.WaitPackName;
        }
    });

    bot.onText(/\/cancel/, async (msg, match) => {
        const chatId = msg.chat.id;

        if (chatId == userId) {
            if (currentStage == Stage.Idle 
                || currentStage == Stage.WaitPackName 
                || currentStage == Stage.WaitShortName) {
                    currentStage = Stage.Idle;
                    await bot.sendMessage(chatId, 'The command newpack was cancelled.');
            }
            else {
                await bot.sendMessage(chatId, 'Can NOT cancel right now.');
            }
        }
    });

    bot.onText(/^[a-zA-Z0-9]+/, async (msg, match) => {
        const chatId = msg.chat.id;
        const input = match[0];

        if (chatId == userId) {
            switch(currentStage) {
                case Stage.Downloading:
                    bot.sendMessage(chatId, 'Wait a second, still downloading Line sticker pack.');
                    break;
                case Stage.WaitPackName:
                    await mtproto.sendMsg(peer, '/cancel');
                    await mtproto.sendMsg(peer, '/newpack');
                    await mtproto.sendMsg(peer, input);
                    await bot.sendMessage(chatId, 'Alright! Now we are uploading sticker, Please wait a minute.');
                    currentStage = Stage.Uploading;
                    await fs.readdir('./StickerSets/pack')
                    .then(async (stickers) => {
                        const total = stickers.length;
                        let count = 1;
                        for (let sticker of stickers) {
                            const stickerPath = path.resolve('./StickerSets/pack/', path.basename(sticker));
                            await mtproto.sendMedia(peer, stickerPath);
                            await mtproto.sendMsg(peer, emoji.emojify(':small_blue_diamond:'));
                            await bot.sendMessage(chatId, 'Uploading...(' + count++ + '/' + total + ')');
                        }
                        await bot.sendMessage(chatId, 'Upload done!');
                        await mtproto.sendMsg(peer, '/publish');
                        await bot.sendMessage(chatId, 'Please provide a short name for your sticker pack.');
                        currentStage = Stage.WaitShortName;
                    })
                    .catch(console.log);
                    break;
                case Stage.Uploading:
                    bot.sendMessage(chatId, 'Wait a minute, we are still uploading sticker.');
                    break;
                case Stage.WaitShortName:
                    await mtproto.sendMsg(peer, input);
                    bot.sendMessage(chatId, 'Your pack should be published at https://t.me/addstickers/' + input);
                    currentStage = Stage.Idle;
                    break;
            }
        }
    });
}

run();
