const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  _id: Number,
  players: {
    type: Map,
    of: Boolean,
  },
  distance: Number,
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
