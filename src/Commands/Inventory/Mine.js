const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Utils/Managers/Inventory/InventoryManager");

const moment = require("moment");
require("moment-duration-format");

const User = require("../../Utils/Schemas/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    if(!user.Mine){
        user.markModified("Mine");
        user.Mine = {
            Pickaxe: {
                Have: false,
                Use: 0,
                MaxUse: 0
            }
        }
        user.save();
    }

    if(!user.Mine.Pickaxe.Have) return message.reply("maden yapmak istiyorsan bir kazmaya ihtiyacın var!");

    let rnd = Math.random();
    let items = InventoryManager.FindItems("SOURCE").sort((a,b) => b.RarityMax - a.RarityMax);
    let item = items.find(item => item.RarityMax >= rnd && item.RarityMin <= rnd);

    let broken = false;
    if(user.Mine.Pickaxe.Use + 1 > user.Mine.Pickaxe.MaxUse) broken = true;

    if(item) {
        InventoryManager.addItemOfInventory(user, item, 1);
        User.updateOne({Id: message.author.id}, {$set: {"Mine.Pickaxe.Have": broken ? false : true}, $inc: {"Mine.TotalMined": 1, "Mine.Pickaxe.Use": 1}}).exec();
    }
    else User.updateOne({Id: message.author.id}, {$set: {"Mine.Pickaxe.Have": broken ? false : true}, $inc: {"Mine.TotalMined": 1, "Mine.Pickaxe.Use": 1}}).exec();

    message.reply(`:pick: madeni kazmaya başladın ve **${item ? item.Name + " buldun!" : "bir şey bulamadın!"}** ${broken ? "(kazman kırıldı)" : ""}`);
}

module.exports.settings = {
    Commands: ["mine", "kaz"],
    Usage: "",
    Description: "",
    cooldown: 30000,
    Activity: true
}