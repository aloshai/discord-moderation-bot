const { Message, Client } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Authorization.Transporter.Roles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.")
    if (args.length != 1) return message.reply("lütfen yanına gitmek istediğin kişiyi etiketle.");

    if (!message.member.voice.channelID) return message.reply("herhangi bir ses kanalında olmadığın sürece birisinin yanına gidemezsin.");

    let targetMember = message.mentions.members.first() || await message.guild.getMember(args[0]);
    if (!targetMember) return message.reply("geçerli bir etiket atmalı ya da ID girmelisin.");

    if (!targetMember.voice.channelID) return message.reply("etiketlediğin kişi herhangi bir kanalda değil.");
    if (targetMember.voice.channelID == message.member.voice.channelID) return message.reply("ikinizde aynı kanaldasınız.");

    message.member.voice.setChannel(targetMember.voice.channelID);
}

module.exports.settings = {
    Commands: ["forcejoin", "forcego", "forcegit", "zorlagit", "fgit", "fgo"],
    Usage: "forcejoin <member|id>",
    Description: "Etiketlemiş olduğun kişi herhangi bir odadaysa onun odasına zorla girersin.",
    Category: "Useable",
    Activity: true
}