const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    message.channel.csend(Settings.Tag.Symbol)
}

module.exports.settings = {
    Commands: ["tag"],
    Usage: "tag",
    Description: "Sunucuya ait özel bir sembol varsa, bunu sana metin olarak atar.",
    Category: "Info",
    cooldown: 2500,
    Activity: true
}