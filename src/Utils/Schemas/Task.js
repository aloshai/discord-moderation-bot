const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  StartTime: Date,
  Task: { type: Object, default: {} },
  ComplatedTask: { type: Array, default: [] },
  Difficulty: { type: Number, default: 0 },
  Authorized: {type: Object, default: {}}
});

const model = mongoose.model("Tasks", schema);
module.exports = model;

/**
 * @param {String} id
 * @returns {Document} 
 */
module.exports.findOrCreate = async (id) => {
  let data = await model.findOneAndUpdate({Id: id}, {}, {setDefaultsOnInsert: true, new: true, upsert: true});
  return data;
}