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
    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Jail.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("yeterli yetkin yok.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.getUser(args[0]);
    if (!victim) return message.reply(`birisini etiketlemelisin.`);

    let penals = await PenalManager.getPenals({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.JAIL }, { Type: PenalManager.Types.TEMP_JAIL }] });
    if (penals.length <= 0) return message.reply(`${victim}(${victim.username}) kişisinin hiç hapsi yok.`);

    let member = await message.guild.getMember(victim.id);
    if (member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini susturamazsın.");

    let cezaNumaraları = penals.map(penal => penal.Id);

    let msg = await message.reply(`${victim} kişisinin toplam **${penals.length}** adet hapis var. Cezalardan hangisin kaldırmak istiyorsunuz? \`(${cezaNumaraları.map(e => "#" + e).join(", ")})\``);

    let messages = await msg.channel.awaitMessages((m) => m.author.id == message.author.id && cezaNumaraları.some(cevap => m.content.toLowerCase().includes(cevap)), {
        max: 1,
        time: 15000
    });

    if (messages.size <= 0) {
        return message.reply(`${member ? member.displayName : victim.username}(${victim.id}) için başlatmış olduğun ceza kaldırma işlemi cevap vermediğin için iptal ediliyor.`);
    }

    let reply = messages.first();
    let penalId = cezaNumaraları.find(e => reply.content.includes(e));
    if (penalId) {
        penalId = Number(penalId);
        await Penal.updateMany({ Id: penalId }, { $set: { Activity: false } }).exec();
        if (member && member.roles.cache.has(Settings.Penals.Jail.Role)) member.setRoles(Settings.Roles.Unregistered);

        message.reply(`${member ? member.displayName : victim.username}(${victim.id}) kullanıcısının \`#${penalId}\` numaralı hapis cezasını kaldırdın. ✅`);
    }
    else message.reply(`${member ? member.displayName : victim.username}(${victim.id}) ceza kaldırma işlemi iptal edildi.`);
};

module.exports.settings = {
    Commands: ["unjail"],
    Usage: "unjail <@user|id>",
    Description: "Etiketlediğin kişinin sunucuda hapis cezası varsa bunu kaldırırsın..",
    Category: "Penal",
    Activity: true
}