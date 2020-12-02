const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  AllVoice: { type: Number, default: 0 },
  AllMessage: { type: Number, default: 0 },
  Voice: { type: Object, default: {} },
  Message: { type: Object, default: {} }
});

const model = mongoose.model("Stats", schema);

module.exports = model;