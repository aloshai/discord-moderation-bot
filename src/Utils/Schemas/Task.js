const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Activity: Boolean,
  Target: String,
  StartTime: Date,
  FinishTime: Date,
  Message: Number,
  Voice: Number,
  Reason: String,
  Members: Array
});

const model = mongoose.model("Tasks", schema);
module.exports = model;