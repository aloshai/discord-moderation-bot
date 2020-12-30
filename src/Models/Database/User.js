const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Id: String,
  Coin: {type: Number, default: 0},
  Inventory: {type: Array, default: []},
  DailyCrate: {type: Number },
  DailyCoin: {type: Number},
  Mine: {
    Pickaxe: {
      Have: {type: Boolean, default: false},
      Use: {type: Number, default: 0},
      MaxUse: {type: Number}
    },
    TotalMined: {type: Number, default: 0},
    type: Object
  },
  Authorized: { type: Boolean, default: false },
  Rank: { type: Number, default: 0 },
  Usage: { type: Object, default: {} },
  Names: { type: Array, default: [] },
  Notes: { type: Array, default: [] }
});

const model = mongoose.model("Users", schema);

module.exports = model;

/**
 * @param {String} id
 * @returns {Document} 
 */
module.exports.findOrCreate = async (id) => {
  let user = await model.findOneAndUpdate({Id: id}, {}, {setDefaultsOnInsert: true, new: true, upsert: true});
  return user;
}