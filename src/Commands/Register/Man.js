const {Message, Client} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Registers.AuthRoles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");

    

}

module.exports.settings = {
    Commands: ["man", "erkek", "e"],
    Usage: "",
    Description: "",
    Activity: true
}