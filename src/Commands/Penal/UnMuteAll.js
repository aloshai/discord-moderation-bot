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
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Mute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("yeterli yetkin yok.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.getUser(args[0]);
    if (!victim) return message.reply(`birisini etiketlemelisin.`);

    let penals = await PenalManager.getPenals({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.TEMP_MUTE }, { Type: PenalManager.Types.MUTE }] });
    if (penals.length <= 0) return message.reply("etiketlemiş olduğun kişinin hiç cezası yok.");

    let member = await message.guild.getMember(victim.id);
    if (member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini susturamazsın.");

    let msg = await message.reply(`${victim} kişisinin toplam **${penals.length}** adet sohbet susturması var. Cezaların hepsini kaldırmak istediğinizden emin misiniz? (Evet/Hayır)`);

    let messages = await msg.channel.awaitMessages((m) => m.author.id == message.author.id && ["evet", "hayır", "hayir"].some(cevap => m.content.toLowerCase().includes(cevap)), {
        max: 1,
        time: 15000
    });

    if (messages.size <= 0) {
        return message.reply("tüm susturma cezalarını kaldırmak için başlatmış olduğun işleme cevap vermediğin için işlem iptal ediliyor.");
    }

    let reply = messages.first();
    if (reply.content.toLocaleLowerCase().includes("evet")) {
        await Penal.updateMany({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.TEMP_MUTE }, { Type: PenalManager.Types.MUTE }] }, { $set: { Activity: false } }).exec();
        if (member && member.roles.cache.has(Settings.Penals.Mute.Role)) member.roles.remove(Settings.Penals.Mute.Role);

        message.reply(`${victim} kullanıcısının sunucudaki tüm sohbet cezaları başarılı bir şekilde kaldırıldı. ✅`);
    }
    else message.reply("sohbet cezaları kaldırma işlemi iptal edildi.");
}

module.exports.settings = {
    Commands: ["unmuteall", "unmall"],
    Usage: "unmuteall <@user|id>",
    Description: "Etiketlediğin kişinin tüm sohbet susturmalarını kaldırırsın.",
    Category: "Penal",
    Activity: true
}