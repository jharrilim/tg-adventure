const { Schema, model } = require('mongoose');
const { AreaSchema } = require('./area.model');

const GameSchema = new Schema({
  _id: Number,
  players: {
    type: Map,
    of: Boolean,
  },
  distance: Number,
  difficulty: Number,
  area: Number,
});

const Game = model('Game', GameSchema);

module.exports = Game;
