const { Client, Message } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const PenalManager = require("../../Managers/PenalManager");
const Penal = require("../../Models/Database/Penal");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.VoiceMute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("yeterli yetkin yok.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.getUser(args[0]);
    if (!victim) return message.reply(`birisini etiketlemelisin.`);

    let penals = await PenalManager.getPenals({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.TEMP_VOICE_MUTE }, { Type: PenalManager.Types.VOICE_MUTE }] });
    if (penals.length <= 0) return message.reply("etiketlemiş olduğun kişinin hiç cezası yok.");

    let member = await message.guild.getMember(victim.id);
    if (member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini susturamazsın.");

    let msg = await message.reply(`${victim} kişisinin toplam **${penals.length}** adet sesli susturması var. Cezaların hepsini kaldırmak istediğinizden emin misiniz? (Evet/Hayır)`);

    let messages = await msg.channel.awaitMessages((m) => m.author.id == message.author.id && ["evet", "hayır", "hayir"].some(cevap => m.content.toLowerCase().includes(cevap)), {
        max: 1,
        time: 15000
    });

    if (messages.size <= 0) {
        return message.reply("başlatmış olduğun tüm sesli sohbet susturmalarını kaldırmak işlemine cevap vermediğin için işlemi iptal ettim.");
    }

    let reply = messages.first();
    if (reply.content.toLocaleLowerCase().includes("evet")) {
        await Penal.updateMany({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.TEMP_MUTE }, { Type: PenalManager.Types.MUTE }] }, { $set: { Activity: false } }).exec();
        if (member) {
            if (Settings.Penals.VoiceMute.Role.length > 0 && member.roles.cache.has(Settings.Penals.VoiceMute.Role)) member.roles.remove(Settings.Penals.VoiceMute.Role);
            if (member.voice.channelID && member.voice.serverMute) member.voice.setMute(false);
        }

        message.reply(`${victim} kullanıcısının sunucudaki tüm sesli sohbet cezaları başarılı bir şekilde kaldırıldı. ✅`);
    }
    else message.reply("başlatmış olduğun tüm sesli sohbet cezalarını kaldırma işlemi iptal edildi. ❌");
}

module.exports.settings = {
    Commands: ["unvoicemuteall", "uvmall"],
    Usage: "unvoicemuteall <@user|id>",
    Description: "Bahsettiğin kişinin sunucudaki tüm sesli susturmalarını kaldırırsın.",
    Category: "Penal",
    Activity: true
}