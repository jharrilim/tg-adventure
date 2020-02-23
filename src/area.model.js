const { Schema, model } = require('mongoose');
const { EventSchema } = require('./event.model');

const AreaSchema = new Schema({
  name: String,
  description: String,
  difficulty: Number,
  events: [EventSchema],
});

const Area = model('Area', AreaSchema);

module.exports = Area;
module.exports.AreaSchema = AreaSchema;
