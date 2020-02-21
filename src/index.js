const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

(async () => {
    const mongo = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await mongo.connect();

    const bot = new TelegramBot(
        process.env.BOT_API_TOKEN,
        {
            polling: true,
        }
    );
    bot.onText(/\/start/, msg => {
        
    });
    
        
    bot.on('', async (message, { type }) => {
        if (type !== 'text')
            return;
        return await bot.sendMessage(message.chat.id, 'Hello World');
    });
})().catch(console.error);

