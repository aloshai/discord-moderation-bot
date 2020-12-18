const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Friends: {
    default: {},
    type: Object
  },
  TotalExperience: {
    type: Number,
    default: 0
  }
});

const model = mongoose.model("Friends", schema);


module.exports = model;