const { Message, Client } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const Waiting = new Set();

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (Waiting.has(message.author.id)) return message.reply("hali hazırda yapmış olduğun bir çekme işlemi var. Lütfen " + Settings.Authorization.Transporter.Cooldown + " saniye sonra tekrar dene.")
    if (args.length != 1) return message.reply("lütfen yanına çekmek istediğin kişiyi etiketle ya da ID'sini gir.");

    if (!message.member.voice.channelID) return message.reply("herhangi bir ses kanalında olmadığın sürece birisini yanına çekemezsin.");

    let targetMember = message.mentions.members.first() || await message.guild.getMember(args[0]);
    if (!targetMember) return message.reply("geçerli bir etiket atmalı ya da ID girmelisin.");

    if (!targetMember.voice.channelID) return message.reply("etiketlediğin kişi herhangi bir kanalda değil.");
    if (targetMember.voice.channelID == message.member.voice.channelID) return message.reply("ikinizde aynı kanaldasınız.");

    Waiting.add(message.author.id);
    let msg = await message.channel.csend(`${targetMember}, ${message.member} seni **${targetMember.voice.channel.name}** odasına **__çekmek__** istiyor. Kabul ediyor musun?`).then(x => {
        x.react(`✔`);
        return x;
    });

    let collected = await msg.awaitReactions((react, user) => react.emoji.name == "✔" && user.id == targetMember.id, {
        time: Settings.Authorization.Transporter.Cooldown * 1000,
        max: 1
    });

    if (collected.size > 0 && targetMember.voice.channelID && message.member.voice.channelID) targetMember.voice.setChannel(message.member.voice.channelID);
    Waiting.delete(message.author.id);
}

module.exports.settings = {
    Commands: ["pull", "çek", "getir"],
    Usage: "pull <@member|id>",
    Description: "Etiketlediğin kişiyi yanına çekmek için talep açarsın.",
    Category: "Useable",
    Activity: true
}