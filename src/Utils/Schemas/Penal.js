const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: Number,
  Activity: { type: Boolean, default: true },
  Temporary: { type: Boolean, default: false },
  Time: { type: Number, default: Date.now() },
  FinishTime: Number,
  Admin: String,
  User: String,
  Reason: String,
  Type: String
});

const model = mongoose.model("Penals", schema);
module.exports = model;