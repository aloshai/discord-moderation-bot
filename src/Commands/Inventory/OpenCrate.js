const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Models/Database/User");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    let userItems = InventoryManager.FindItemsToArray(user.Inventory, "CRATE");
    if(userItems.length <= 0) return message.reply("hiç para kasan yok!");

    let userItem = userItems[0];
    let item = InventoryManager.FindItem(userItem.Id);
    
    let coin = item.open();
    userItem.Count -= 1;
    if(userItem.Count <= 0){
        let index = user.Inventory.findIndex(i => i.Id == userItem.Id);
        user.Inventory.splice(index, 1);
    }
    user.Coin += coin;
    user.markModified("Inventory");
    user.save();

    message.reply(`bir altın kasası açtın ve içinden :coin:**${InventoryManager.Number(coin)}** puan buldun! ${message.guild.findEmoji(item.Symbol)}`);
}

module.exports.settings = {
    Commands: ["opencrate"],
    Usage: "opencrate",
    Description: "Envanterinde olan kasaları sırasıyla açarsın. Komutu bir kez kullanırsan, 1 tane kasa açarsın.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}