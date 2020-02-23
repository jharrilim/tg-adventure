const { Schema, model } = require('mongoose');

const EventSchema = new Schema({
  description: String,
  actions: [{
    type: String,
    text: String,
  }],
});

const _Event = model('Event', EventSchema);

module.exports = _Event;
module.exports.EventSchema = EventSchema;
