const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const User = require("../../Models/Database/User");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (message.member.roles.cache.has(Settings.Roles.BoosterRole) && message.mentions.members.size <= 0) {
        let newName = args.join(" ");
        newName = Settings.Authorization.NameChanger.ForceTagFormat.replace("<tag>", message.author.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2).replace("<name>", newName);
        if (newName.length > 32) return message.reply(`isim değiştirme işlemin iptal edildi. Değiştirmek üzere olduğun \`${newName}\` ismi 32 karakterden fazla olmamalı.`);
        if (!message.member.manageable) return message.reply("senin ismini değiştiremiyorum.");

        message.member.setNickname(newName).catch();
        User.updateOne({ Id: message.author.id }, { $push: { "Names": { Admin: message.author.id, Date: Date.now(), Value: newName } } }, { upsert: true }).exec();
        return message.reply(`sunucudaki ismini \`${newName}\` olarak değiştirdim.`);
    }

    if (!message.member.hasPermission("ADMINISTRATOR") && !Settings.Authorization.NameChanger.Roles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");
    let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
    if (!victim) return message.reply(`ismini değiştirmek istediğin kişiyi etiketlemeyi unuttun.`);
    if (!victim.manageable) return message.reply("etiketlediğin kişinin ismini değiştiremiyorum.");

    args = args.splice(1);
    let newName;
    if (Settings.Authorization.Registers.NameAndAge) {
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace(/i/g, "İ").toUpperCase() + arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0] || undefined;
        if (!name) return message.reply("geçerli bir ad girmelisin.");
        if (!age) return message.reply("geçerli bir yaş girmelisin.");
        if (age < Settings.Authorization.Registers.AgeLimit) message.reply(`**Bilgilendirme:** Sunucuda yaş sınırı ${Settings.Authorization.Registers.AgeLimit} olarak belirlenmiştir. *Kayıt işlemi devam ediyor.*`);
        newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${name}${Settings.Authorization.Registers.Brace}${age}`;
    }
    else if (Settings.Authorization.NameChanger.ForceTag) {
        newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${args.join(" ")}`;
    }
    else newName = args.join(" ");
    if (newName.length > 32) return message.reply(`isim değiştirme işlemi iptal edildi. Değiştirmek üzere olduğun \`${newName}\` ismi 32 karakterden fazla olmamalı.`);
    victim.setNickname(newName).catch();
    User.updateOne({ Id: victim.id }, { $push: { "Names": { Admin: message.author.id, Date: Date.now(), Value: newName } } }, { upsert: true }).exec();

    return message.reply(`${victim} kişisinin ismi ${newName} olarak değiştirildi.`);
}

module.exports.settings = {
    Commands: ["name", "isim"],
    Usage: "name [@member <newName>|<newName>]",
    Description: "Eğer boostersan bu komutu kullanarak ismini değiştirebilirsin. Yetkiliysen etiketlediğin kişinin ismini değiştirmek için kullanabilirsin.",
    Category: "Useable",
    Activity: true
}