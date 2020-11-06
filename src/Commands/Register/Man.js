const {Message, Client, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const User = require("../../Utils/Schemas/User");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Registers.AuthRoles.some(role => message.member.roles.cache.has(role))) return message.reply("bunu yapmak için yetkin yok.");

    let victim = message.mentions.members.first() || args[0] ? await message.guild.getMember(args[0]) : undefined;
    if(!victim) return message.reply("bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.");
    let newName; 
    args = args.splice(1);
    if(args.length > 1 && Settings.Registers.NameAndAge){
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace(/i/g, "İ").toUpperCase()+arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0] || undefined;
        if(!name) return message.reply("geçerli bir ad girmelisin.");
        if(!age) return message.reply("geçerli bir yaş girmelisin.");
        if(age < Settings.Registers.AgeLimit) message.reply(`**Bilgilendirme:** Sunucuda yaş sınırı ${Settings.Registers.AgeLimit} olarak belirlenmiştir. *Kayıt işlemi devam ediyor.*`);
        newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${name}${Settings.Registers.Brace}${age}`;
    }
    else newName = `${victim.user.username.includes(Settings.Tag.Symbol) ? Settings.Tag.Symbol : Settings.Tag.Symbol_2} ${args.length <= 0 ? victim.user.username : args.join(" ")}`;

    if(newName >= 32) return message.channel.csend(`UUPS! ${victim} bir sorunumuz var. Etiketlediğin kişinin ismi \`${newName}\` 32 karakterden fazla karakter barındığı için düzenlenemez.`);
    if(victim.manageable) victim.setNickname(newName).catch(console.error);
    let roles = Settings.Registers.ManRoles;

    if(victim.user.username.includes(Settings.Tag.Symbol)) roles.concat(Settings.Tag.Roles);
    victim.setRoles(roles);

    let data = await User.findOneAndUpdate({Id: message.author.id, Authorized: true}, {$inc: {"Usage.Man": 1}});
    message.channel.csend(new MessageEmbed()
    .setDescription(`${message.author}, ${victim} kullanıcısı **ERKEK** olarak kaydettin. \n\n\t **Ayarlanan İsim:** ${newName}`)
    .setFooter(`Erkek: ${data ? (data.Usage.Man || 0) : 0} | Kız: ${data ? (data.Usage.Woman || 0) : 0}`));
}

module.exports.settings = {
    Commands: ["man", "erkek", "e"],
    Usage: "",
    Description: "",
    Activity: true
}