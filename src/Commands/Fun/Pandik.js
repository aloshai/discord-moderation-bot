const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Schemas/Task");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first();
    if(!victim || victim.id == message.author.id) return message.reply("k-kendini mi pandikleyeceksin 😳");
    message.reply(`${victim} üyesini **pandikledi** çabuk kaçır kendini, başın belada!`)
}

module.exports.settings = {
    Commands: ["pandik"],
    Usage: "pandik <@user>",
    Description: "Birisini pandikleyebilirsin.",
    Category: "Fun",
    cooldown: 5000,
    Activity: true
}