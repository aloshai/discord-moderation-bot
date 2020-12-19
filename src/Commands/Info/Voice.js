const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
    if (!victim) return message.reply("birisini etiketlemelisin.");
    message.reply(`etiketlediğin kişi ${victim.voice.channelID ? "**" + victim.voice.channel.name + "** kanalında seste." : "herhangi bir kanalda değil."}`);
}

module.exports.settings = {
    Commands: ["seskontrol", "sesk", "kses", "sk"],
    Usage: "seskontrol <member|id>",
    Description: "Etiketlediğin ya da ID'sini belirttiğin kişinin bir kanalda olup olmadığını, eğer kanaldaysa o kanalın ismini öğrenirsin.",
    Category: "Info",
    cooldown: 2500,
    Activity: true
}