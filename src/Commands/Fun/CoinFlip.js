const {Message, Client, MessageEmbed} = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    message.reply(`**${Math.floor(Math.random() * 2) == 1 ? "yazı" : "tura"}** çıktı!`);
}

module.exports.settings = {
    Commands: ["yazitura", "yazıtura", "yazi-tura", "yazı-tura", "coinflip"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}