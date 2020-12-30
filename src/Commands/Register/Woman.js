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

    if (victim.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisini kayıt edemezsin.")

    let newName;
    args = args.splice(1);
    if (args.length > 1 && Settings.Authorization.Registers.NameAndAge) {
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace(/i/g, "İ").toUpperCase() + arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0] || undefined;
        if (!name) return message.reply("geçerli bir ad girmelisin.");
        if (!age) return message.reply("geçerli bir yaş girmelisin.");
        if (age < Settings.Authorization.Registers.AgeLimit) message.reply(`**Bilgilendirme:** Sunucuda yaş sınırı ${Settings.Authorization.Registers.AgeLimit} olarak belirlenmiştir. *Kayıt işlemi devam ediyor.*`);
        newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${name}${Settings.Authorization.Registers.Brace}${age}`;
    }
    else newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${args.length <= 0 ? victim.user.username : args.join(" ")}`;

    if (newName >= 32) return message.channel.csend(`UUPS! ${victim} bir sorunumuz var. Etiketlediğin kişinin ismi \`${newName}\` 32 karakterden fazla karakter barındırdığı için düzenlenemez.`);
    if (!victim.manageable) return message.reply("bu kişinin yetkisi benden yüksek.");
    victim.setNickname(newName).catch(console.error);
    let roles = Settings.Authorization.Registers.WomanRoles;

    if (victim.user.username.includes(Settings.Tag.Symbol)) roles.concat(Settings.Tag.Roles);
    victim.setRoles(roles);

    User.updateOne({ Id: victim.id }, { $push: { "Names": { Admin: message.author.id, Date: Date.now(), Value: newName } } }, { upsert: true }).exec();
    let data = await User.findOneAndUpdate({ Id: message.author.id, Authorized: true }, { $inc: { "Usage.Woman": 1 } }).exec();
    message.channel.csend(new MessageEmbed()
        .setDescription(`${message.author}, ${victim} kullanıcısı **KIZ** olarak kaydettin. \n\t **Ayarlanan İsim:** ${newName}`)
        .setFooter(`Erkek: ${data ? (data.Usage.Man || 0) : 0} | Kız: ${data ? (data.Usage.Woman || 0) : 0}`));
}

module.exports.settings = {
    Commands: ["woman", "kız", "kiz", "k"],
    Usage: "woman <@member|id> <Name|Name Age>",
    Description: "Bahsettiğin kişiyi sunucuda kız olarak kaydedersin.",
    Category: "Register",
    Activity: true
}