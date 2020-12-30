const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const User = require("../../Models/Database/User");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Authorization.Registers.Roles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");

    let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
    if (!victim) return message.reply("bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.");

    if (victim.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini kayıt edemezsin.");
    if (!victim.manageable) return message.reply("bu kişinin yetkisi benden yüksek.");

    let roles = Settings.Roles.Unregistered;
    victim.setRoles(roles);

    User.updateOne({ Id: message.author.id, Authorized: true }, { $inc: { "Usage.Unregistered": 1 } }).exec();
    message.channel.csend(`${victim}, ${message.author} tarafından **kayıtsız** rolüne atıldı.`);
}

module.exports.settings = {
    Commands: ["unregister", "kayıtsız", "kayitsiz"],
    Usage: "unregister <@member|id>",
    Description: "Bahsettiğin kişiyi sunucuda kayıtsıza atarsın.",
    Activity: true,
    Category: "Register",
    cooldown: 10000
}