const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  StartTime: Date,
  Task: { type: Object, default: {} },
  ComplatedTask: { type: Array, default: [] },
  Difficulty: { type: Number, default: 0 }
});

const model = mongoose.model("Tasks", schema);
module.exports = model;