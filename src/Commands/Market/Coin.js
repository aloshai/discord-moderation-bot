const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Utils/Managers/Inventory/InventoryManager");

const User = require("../../Utils/Schemas/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || message.author;

    let user = await User.findOrCreate(victim.id);
    if(!user.Coin){
        user.Coin = 0;
        user.save();
    }
    message.reply(`toplam :coin:**${InventoryManager.Number(user.Coin)}** puanın var.`)
}

module.exports.settings = {
    Commands: ["coin", "puan", "puanım", "puanim"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}