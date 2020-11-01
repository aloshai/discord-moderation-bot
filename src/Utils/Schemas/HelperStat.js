const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Voice: {type: Number, default: 0},
  Message: {type: Number, default: 0}
});

const model = mongoose.model("HelperStats", schema);

module.exports = model;