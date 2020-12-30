const {Client, Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Helper = require("../../Utils/Helper");

const ms = require("ms");

const PM = require("../../Managers/PenalManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Mute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("yeterli yetkin yok.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`birisini etiketlemelisin.`);
    
    let time = args[1];
    if(!time || !ms(time)) return message.reply("lütfen geçerli bir süre girin.");
    time = ms(time);
    
    let reason = args.splice(2).join(" ");
    if(!reason) return message.reply("bir sebep belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini susturamazsın.")

    if(member && member.manageable && !member.roles.cache.has(Settings.Penals.Mute.Role)) member.roles.add(Settings.Penals.Mute.Role).catch();

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.TEMP_MUTE, reason, true, Date.now(), time);

    message.channel.csend(`**${victim}(${victim.username})** kullanıcısı ${message.author}(${message.author.username}) tarafından **"${reason}"** sebebiyle geçici olarak susturuldu. (Ceza Numarası: \`#${document.Id}\`)`)
    message.guild.log(message.author, victim, document, Settings.Penals.Mute.Log);
}

module.exports.settings = {
    Commands: ["tempmute", "geçicisustur"],
    Usage: "tempmute <@user|id> <time> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda geçici olarak yazılı susturursun.",
    Category: "Penal",
    Activity: true
}