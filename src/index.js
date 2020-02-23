require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const connect = require('./connect');
const Player = require('./player.model');
const Game = require('./game.model');
const areas = require('./areas');
const { escape } = require('./text');

const {
  BOT_API_TOKEN,
} = process.env;

const ActionType = {
  Event: 1 << 0,
  Area: 1 << 1,
};

const sample = (arr = []) => Math.floor(Math.random() * arr.length);

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
        health: 10,
        stamina: 10,
      });
    } catch {
      return {};
    }
  }

  const displayArea = (chatId, { name, description, difficulty }) => bot.sendMessage(
    chatId,
    escape(`*${name}*\n${description}`),
    {
      reply_markup: {
        resize_keyboard: true,
        remove_keyboard: true,
        inline_keyboard: [[
          {
            text: 'Go',
            callback_data: JSON.stringify({
              t: ActionType.Area,
              i: 0,
            })
          },
          {
            text: `Skip (-${difficulty} Stamina)`,
            callback_data: JSON.stringify({
              t: ActionType.Area,
              i: 1,
              d: difficulty,
            })
          }
        ]]
      },
      parse_mode: 'MarkdownV2',
    });

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
      const startingAreas = areas.filter(area => area.difficulty === 1);
      const startingAreaIndex = sample(startingAreas);
      const { description, name, difficulty } = startingAreas[startingAreaIndex];
      Game.create({
        _id: msg.chat.id,
        distance: 0,
        difficulty: 1,
        area: startingAreaIndex,
        players: {
          [msg.from.id]: true,
        },
      }).catch(_ => console.info('Game already exists'));
      await bot.sendMessage(msg.chat.id, 'Your adventure begins.');
      await displayArea(msg.chat.id, { description, name, difficulty });
      // await bot.sendMessage(
      //   msg.chat.id,
      //   escape(`*${start.name}*\n${start.description}`),
      //   {
      //     reply_markup: {
      //       resize_keyboard: true,
      //       remove_keyboard: true,
      //       inline_keyboard: [
      //         start.events[0].actions.map((action, i) => ({
      //           text: escape(action.text),
      //           callback_data: JSON.stringify({
      //             t: ActionType.Event,
      //             i
      //           })
      //         }))
      //       ]
      //     },
      //     parse_mode: 'MarkdownV2',
      //   });
    } catch (e) {
      console.error(e);
    }
  });

  bot.on('callback_query', async query => {
    const data = JSON.parse(query.data || {});
    switch (Number.parseInt(data.t || -1)) {
      case ActionType.Event:
        Number.parseInt(data.i)
        break;
      case ActionType.Area:
        switch(Number.parseInt(data.i)) {
          case 0: // Go
          const game = await Game.findById(query.message.chat.id);
          console.log(game);
          const eventIndex = sample(areas[game.area].events);
          const event = areas[game.area].events[eventIndex];
          bot.editMessageText(
            event.description,
            {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
            }
          )
          bot.editMessageReplyMarkup({
            inline_keyboard: [
              event.actions.map((action, i) => ({
                text: action.text,
                callback_data: JSON.stringify({
                  t: ActionType.Event,
                  e: eventIndex,
                  a: game.area,
                  i
                })
              }))
            ]
          }, {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
          })
          break;
          case 1: // Skip
          break;
        }
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