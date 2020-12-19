const { Message, Client } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Authorization.Transporter.Roles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");
    if (args.length != 1) return message.reply("lütfen yanına çekmek istediğin kişiyi etiketle ya da ID'sini yaz.");

    if (!message.member.voice.channelID) return message.reply("herhangi bir ses kanalında olmadığın sürece birisini yanına çekemezsin.");

    let targetMember = message.mentions.members.first() || await message.guild.getMember(args[0]);
    if (!targetMember) return message.reply("geçerli bir etiket atmalı ya da ID girmelisin.");

    if (!targetMember.voice.channelID) return message.reply("etiketlediğin kişi herhangi bir kanalda değil.");
    if (targetMember.voice.channelID == message.member.voice.channelID) return message.reply("ikinizde aynı kanaldasınız.");

    targetMember.voice.setChannel(message.member.voice.channelID);
}

module.exports.settings = {
    Commands: ["forcepull","zorlaçek", "zorlagetir", "forceçek", "forcecek", "zorlacek", "forcegetir", "fcek", "fgetir", "fpull"],
    Usage: "forcepull <@member|id>",
    Description: "Etiketlediğin kişi herhangi bir kanaldaysa yanına zorla çekersin.",
    Category: "Useable",
    Activity: true
}