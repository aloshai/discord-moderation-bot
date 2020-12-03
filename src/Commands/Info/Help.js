const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let commandNames = global.Commands.map(e => "`" + Config.Prefix + e.settings.Commands[0] + ":` " + e.settings.Commands.splice(1).join(", "));
    message.channel.csend(new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(commandNames.join("\n")));
}

module.exports.settings = {
    Commands: ["yardim", "help", "yardım"],
    Usage: "",
    Description: "",
    cooldown: 10000,
    Activity: true
}