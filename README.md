# SticKerKer
A bot to convert Line stickers to Telegram.

## Requirement
1. node.js
  - version >= 9.11.1

2. npm
  -  version >= 5.6.0

3. Build TDLib
  -  https://github.com/tdlib/td#building
  
4. Obtain your Telegram Application `api_id` and `api_hash` from [Here](https://core.telegram.org/api/obtaining_api_id)

5. Obtain your Telegram Bot `Token` from [BotFather](https://core.telegram.org/bots#6-botfather)

6. Obtain your Telegram `Chat ID` from [@id_chatbot](https://telegram.me/id_chatbot)




## Installation
```
git clone https://github.com/KylinWu/SticKerKer.git
cd SticKerKer
npm install --save
cp .env.example .env
```

-  Fill in the `api_id`, `api_hash`, `Token` and `Chat Id` in the `.env` file.
-  After TDLib build finished , copy TDLib shared-library `libtdjson.so` to TDL directory.
   ```
   cp <TDLib>/build/libtdjson.so <SticKerKer>/TDL/
   ```


## Usage
```
node index.js
```

## Knowing issues

 - (2018/5/21 - abandoned library) 
	 - ~~For now, the telegram-mtproto 3.1.3 is only works for `dev` data center (hereinafter “DC”). If you want to connect to `prod` DC, you could install version 2.2.8 but this version is very unstable and highly possible to get a temporary ban (a few hours)~~. 


