require('dotenv').config({path: __dirname + '/.env'});
const API = require('./API');
const TDL = require('./TDL');
const TelegramBot = require('node-telegram-bot-api');
const api = new API();
const tdl = new TDL();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

const fs = require('mz/fs');
const path = require('path');
const emoji = require('node-emoji');

const userChatId = process.env.TELEGRAM_USER_CHAT_ID;

const timeout = ms => new Promise(res => setTimeout(res, ms))
const delay = async  ms => {
      await timeout(ms)
}

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

const run = async () => {
    await tdl.auth();
    const stickersChatId = await tdl.getChatId('@Stickers');
    bot.onText(/\/start/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (chatId == userChatId) {
           await bot.sendMessage(chatId, helpMsg);
        }
    });

    bot.onText(/\/help/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (chatId == userChatId) {
            await bot.sendMessage(chatId, helpMsg);
        }
    });

    bot.onText(/\/newpack ([0-9]{7})/, async (msg, match) => {
        //Only responses my chat by id
        const chatId = msg.chat.id;
        const stickerID = match[1];

        if (chatId == userChatId && currentStage == Stage.Idle) {
            await bot.sendMessage(chatId, 'Start downloading Line sticker pack ' + stickerID);
            currentStage = Stage.Downloading;
            await api.download(stickerID);
            bot.sendMessage(chatId, 'Please give a name for your pack.');
            currentStage = Stage.WaitPackName;
        }
    });

    bot.onText(/\/cancel/, async (msg, match) => {
        const chatId = msg.chat.id;

        if (chatId == userChatId) {
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

        if (chatId == userChatId) {
            switch(currentStage) {
                case Stage.Downloading:
                    bot.sendMessage(chatId, 'Wait a second, still downloading Line sticker pack.');
                    break;
                case Stage.WaitPackName:
                    await tdl.sendMsg(stickersChatId, '/cancel');
                    await tdl.sendMsg(stickersChatId, '/newpack');
                    await tdl.sendMsg(stickersChatId, input);
                    await bot.sendMessage(chatId, 'Alright! Now we are uploading sticker, Please wait a minute.');
                    currentStage = Stage.Uploading;

                    await fs.readdir('./StickerSets/pack')
                    .then(async (stickers) => {
                        const total = stickers.length;
                        let count = 1;
                        let match, lastMsg;
                        const regex = /Thanks! Now send me an emoji that corresponds to your first sticker\./g;
                        for (let sticker of stickers) {
                            const stickerPath = path.resolve('./StickerSets/pack/', path.basename(sticker));
                            console.log('Sending stickers... ' + count + '/' + total);
                            await tdl.sendFile(stickersChatId, stickerPath);
                            do {
                                await delay(800);
                                lastMsg = await tdl.getLastMsg(stickersChatId);
                                match = regex.test(lastMsg);
                                console.log((match)?'Response Checked.':'Not yet response.');
                            } while (match !== true);
                            await tdl.sendMsg(stickersChatId, emoji.emojify(':small_blue_diamond:'));
                            await bot.sendMessage(chatId, 'Uploading...(' + count++ + '/' + total + ')');
                        }
                        await bot.sendMessage(chatId, 'Upload done!');
                        await tdl.sendMsg(stickersChatId, '/publish');
                        await bot.sendMessage(chatId, 'Please provide a short name for your sticker pack.');
                        currentStage = Stage.WaitShortName;
                    })
                    .catch(console.log);
                    break;
                case Stage.Uploading:
                    bot.sendMessage(chatId, 'Wait a minute, we are still uploading sticker.');
                    break;
                case Stage.WaitShortName:
                    const regex = /Sorry, this short name is already taken\./g;
                    tdl.sendMsg(stickersChatId, input);
                    do {
                        await delay(800);
                        lastMsg = await tdl.getLastMsg(stickersChatId);
                    } while (!lastMsg)
                    if (regex.test(lastMsg)) {
                        bot.sendMessage(chatId, 'Sorry, this short name is already taken. Give me another one.');
                        break;
                    }
                    bot.sendMessage(chatId, 'Your pack should be published at https://t.me/addstickers/' + input);
                    currentStage = Stage.Idle;
                    break;
            }
        }
    });
}

run();
