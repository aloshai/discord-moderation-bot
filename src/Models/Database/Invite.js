const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Inviter: String,
  IsFake: { type: Boolean, default: false },
  Regular: { type: Number, default: 0 },
  Fake: { type: Number, default: 0 },
  Bonus: { type: Number, default: 0 },
  Leave: { type: Number, default: 0 }
});

const model = mongoose.model("Invites", schema);

module.exports = model;