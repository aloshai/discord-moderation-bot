const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Day: { type: Number, default: 1 },
  NextUpdate: { type: Number, default: new Date().setHours(24, 0, 0, 0) },
  AuthRanks: { type: Array, default: [] }
});

const model = mongoose.model("Guilds", schema);

module.exports = model;