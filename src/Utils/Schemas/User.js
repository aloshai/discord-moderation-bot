const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Authorized: {type: Boolean, default: false},
  Rank: {type: Number, default: 0},
  Usage: {type: Object, default: {}},
  Names: {type: Array, default: []},
  Notes: {type: Array, default: []}
});

const model = mongoose.model("Authorizeds", schema);

module.exports = model;