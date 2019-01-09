const telegram = require('./init');
const fs = require('mz/fs');
const crypto = require('crypto');
const path = require('path');

const setNotificationSettings = async (chat_id, mute_for) => {
    await telegram.invoke({
        _: 'setChatNotificationSettings',
        chat_id: chat_id,
        notification_settings: {
            _: 'notificationSettings',
            mute_for: mute_for,
            sound: 'default',
            show_preview: true
        }
    })
}

const muteChat = async chat_id => {
    return await setNotificationSettings(chat_id, 300);
}

const unmuteChat = async chat_id => {
    return await setNotificationSettings(chat_id, 0);
}

const searchPublicChat = async username => {
    return await telegram.invoke({
        _: 'searchPublicChat',
        username: username
    });
}

const sendBotStartMessage = async bot_user_id => { 
    await telegram.invoke({
        _: 'sendBotStartMessage',
        bot_user_id: bot_user_id,
        chat_id: bot_user_id,
        parameter: 'start'
    });
}

const getUserId = async username => {
    return await searchPublicChat(username)
    .then(result => {
        return result.id;
    });
}

const getChatId = async username => {
    const bot_user_id = await getUserId(username);
    await sendBotStartMessage(bot_user_id);
    return await searchPublicChat(username)
    .then(result => {
        return result.last_message.chat_id;
    });
}

const getLastMsg = async chat_id => {
    return await getChat(chat_id)
    .then(result => {
        if (typeof result.last_message.content.text !== "undefined")
            return result.last_message.content.text.text;
        else 
            return "";
    });
}

const getChat = async chat_id => {
    return await telegram.invoke({
        _: 'getChat',
        chat_id: chat_id
    })
    then(console.log);
}

const sendFile = async (chat_id, file) => {
    return await telegram.invoke({
        _: 'sendMessage',
        chat_id: chat_id,
        input_message_content: {
            _: 'inputMessageDocument',
            document: {
                _: 'inputFileLocal',
                path: file
            }
        }
    })
}

const sendMsg = async (chat_id, message) => {
    return await telegram.invoke({
        _: 'sendMessage',
        chat_id: chat_id,
        input_message_content: {
            
            _: 'inputMessageText',
            text: {
                _:'formattedText',
                text: message,
            }
        }
    })
    .then(console.log('Send Message :' + message))
    .catch(console.log);
}

module.exports = { sendMsg, getChatId, sendFile, getLastMsg, muteChat, unmuteChat };
