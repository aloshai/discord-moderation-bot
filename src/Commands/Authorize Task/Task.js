const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Utils/Schemas/Task");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    
}

module.exports.settings = {
    Commands: ["ygörev", "y-görev", "a-task", "atask","yetkiligörev"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}