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
    Usage: "",
    Description: "",
    cooldown: 2500,
    Activity: true
}