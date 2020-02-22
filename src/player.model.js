const mongoose = require('mongoose');

/**
 * @typedef PlayerProperties
 * @type {{ id: string; }}
 */

/**
 * @type {mongoose.Schema<PlayerProperties>}
 */
const PlayerSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  firstName: String,
  lastName: String,

});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
