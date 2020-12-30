const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Models/Database/Task");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    message.reply(`${Math.floor(Math.random() * 2) == 1 ? "yazı" : "tura"} çıktı!`);
}

module.exports.settings = {
    Commands: ["yazitura", "turayazi", "yazıtura", "turayazı"],
    Usage: "yazıtura",
    Description: "Havaya para atıyorsun ve yere düşüyor, artık şansına ne çıkarsa :D",
    Category: "Fun",
    cooldown: 5000,
    Activity: true
}