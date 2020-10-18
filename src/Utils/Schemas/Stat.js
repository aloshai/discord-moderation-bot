const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Voice: {type: Object, default: {}},
  Message: {type: Object, default: {}}
});

const model = mongoose.model("Stats", schema);

module.exports = model;