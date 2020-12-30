const {Client, Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Helper = require("../../Utils/Helper");

const PM = require("../../Managers/PenalManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.VoiceMute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("yeterli yetkin yok.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`birisini etiketlemelisin.`);
    
    let reason = args.splice(1).join(" ");
    if(!reason) return message.reply("bir sebep belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini sesli susturamazsın.")

    if(member && member.manageable) {
        if(!member.roles.cache.has(Settings.Penals.VoiceMute.Role)) member.roles.add(Settings.Penals.VoiceMute.Role);
        if(member.voice.channelID && !member.voice.serverMute) member.voice.setMute(true);
    }

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.VOICE_MUTE, reason);

    message.channel.csend(`**${victim}(${victim.username})** kullanıcısı ${message.author}(${message.author.username}) tarafından **"${reason}"** sebebiyle sesli susturuldu. (Ceza Numarası: \`#${document.Id}\`)`)
    message.guild.log(message.author, victim, document, Settings.Penals.VoiceMute.Log);

    (await message.channel.fetchWebhooks())
}

module.exports.settings = {
    Commands: ["voicemute", "seslisustur"],
    Usage: "voicemute <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda kalıcı olarak susturursun.",
    Category: "Penal",
    Activity: true
}