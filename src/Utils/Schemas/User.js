const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Names: {type: Array, default: []},
  Usage: {type: Object, default: {}},
  Notes: {type: Array, default: []}
});

const model = mongoose.model("Auths", schema);

module.exports = model;