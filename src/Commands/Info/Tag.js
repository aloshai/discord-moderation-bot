const {Message, Client, MessageEmbed} = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
	message.channel.csend("ϯ")
}

module.exports.settings = {
    Commands: ["tag"],
    Usage: "",
    Description: "",
    cooldown: 2500,
    Activity: true
}