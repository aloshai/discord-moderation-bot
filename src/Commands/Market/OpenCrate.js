const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Utils/Schemas/User");
const InventoryManager = require("../../Utils/Managers/Inventory/InventoryManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    let userItem = InventoryManager.FindItemToArray(user.Inventory, "COMMON_CRATE");
    if(!userItem) return message.reply("hiç para kasan yok!");

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

    message.reply(`bir altın kasası açtın ve içinden **${coin}** :coin: puan buldun! ${message.guild.findEmoji(item.Symbol)}`);
}

module.exports.settings = {
    Commands: ["opencrate"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}