const {Message, Client, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const User = require("../../Utils/Schemas/User");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {

    

    //if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Authorization.Registers.AuthRoles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");
}

module.exports.settings = {
    Commands: ["name", "isim"],
    Usage: "",
    Description: "",
    Activity: true
}