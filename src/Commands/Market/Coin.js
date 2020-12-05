const { Message, Client, MessageEmbed } = require("discord.js");

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
    message.reply(`toplam **🪙${user.Coin}** puanın var.`)
}

module.exports.settings = {
    Commands: ["coin", "puan", "puanım", "puanim"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}