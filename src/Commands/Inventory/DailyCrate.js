const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Models/Database/User");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    if(user.DailyCrate){
        let nextDay = user.DailyCrate + (1000 * 60 * 60 * 24 * 1);
        if(Date.now() < nextDay){
            return message.reply(`yeni kasa almak için **${moment.duration((nextDay - Date.now())).format("HH:mm:ss")} saat** beklemen gerekiyor!`);
        }
    }
    let item = InventoryManager.FindItem("COIN_CRATE");
    InventoryManager.addItemOfInventory(user, item, 1);
    User.updateOne({_id: user._id}, {$set: {"DailyCrate": Date.now()}}).exec();
    message.reply(`günlük ${message.guild.findEmoji(item.Symbol)}**${InventoryManager.Number(1)}** aldın!`);
}

module.exports.settings = {
    Commands: ["dailycrate"],
    Usage: "dailycrate",
    Description: "Günlük alabileceğin kasayı alırsın.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}