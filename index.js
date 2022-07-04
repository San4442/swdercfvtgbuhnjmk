const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5529316291:AAHtEmIHvIP0dSaz3-gZXrYJnReUJtOwUv4';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты попробуй её угадать!`);
    const randomNum = Math.floor(Math.random() * 10);
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить имя пользователя'},
        {command: '/game', description: 'Игра: Угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
            return bot.sendMessage(chatId, 'Привет, новый пользователь!');
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name}!`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю!');
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId =  msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}!`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру: ${chats[chatId]}!`, againOptions);
        }
    });
}

start();