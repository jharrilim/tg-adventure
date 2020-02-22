require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const connect = require('./connect');
const Player = require('./player.model');
const Game = require('./game.model');

const {
  BOT_API_TOKEN,
} = process.env;

(async () => {
  await connect();

  const bot = new TelegramBot(
    BOT_API_TOKEN,
    {
      polling: true,
    }
  );
  const createUser = async ({ id, name, firstName, lastName }) => {
    try {
      return await Player.create({
        _id: id,
        name,
        firstName,
        lastName,
        health: 100,
      });
    } catch {
      return {};
    }
  }
  bot.onText(/^\/join/, async msg => {
    try {
      const player = await createUser({
        id: msg.from.id,
        name: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
      });
      if (player.name)
        await bot.sendMessage(msg.chat.id, `Welcome to the game, ${player.name}.`);
      else
        await bot.sendMessage(msg.chat.id, `You are already in the game, ${msg.from.username}.`)
          .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  });

  bot.onText(/^\/go/, async msg => {
    console.log(msg);
  });

  bot.onText(/^\/start/, async msg => {
    try {
      await createUser({
        id: msg.from.id,
        name: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
      });
      Game.create({
        _id: msg.chat.id,
        distance: 0,
        players: {
          [msg.from.id]: true,
        },
      }).catch(_ => console.info('Game already exists'));
      await bot.sendMessage(msg.chat.id, 'What do you do next?', {
        reply_markup: {
          resize_keyboard: true,
          remove_keyboard: true,
          inline_keyboard: [[
            {
              text: 'Yeet?',
              callback_data: JSON.stringify({
                action: 'yeet'
              })
            }
          ]]
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  bot.on('callback_query', async query => {
    const data = JSON.parse(query.data || {});
    switch (data.action || '') {
      case 'yeet':
        await bot.deleteMessage(query.message.chat.id, query.message.message_id);
        await bot.sendMessage(query.message.chat.id, 'You yeeted!');
        break;
      default:
        break;
    }
  })
})().catch(console.error);


// Edit Keyboard:
// bot.editMessageReplyMarkup({
//   inline_keyboard: [[]]
// }, {
//   chat_id: query.message.chat.id,
//   inline_message_id: query.inline_message_id,
//   message_id: query.message.message_id,
// })