const Discord = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

const Penal = require("../../Utils/Schemas/Penal");

const TimeManager = require("../../Utils/Managers/TimeManager");
const tm = new TimeManager();

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("bunu yapmak için yeterli bir yetkiye sahip değilsin.");

    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!victim) return message.reply("birisini etiketlemelisin.")

    Penal.find({ User: victim.id }, async (err ,res) => {
        if(err) return message.reply("bazı problemler yaşıyoruz :(");
        res = res.reverse();

        let page = 1;
        const liste = res.map((e, i) => `\`#${e.Id}:\` \`${e.Activity == true ? "✅" : "❌"}\` **[${e.Type}]** <@${e.Admin}>: **${e.Reason}** - ${moment(e.Date).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}`);

        var msg = await message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${message.guild.name} sunucunda ${victim} kullanıcısının tüm cezaları aşağıda listenmiştir. Cezaların hiçbiri silinmemektedir, aktif olmayan cezaların yanında :x: aktif olanların yanında ✅ işareti vardır.`)
        .addField(`Cezalar`, `${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")} ** **`)
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))).then(e => e);
        
        if(liste.length > 10){
            await msg.react(`◀`);
            await msg.react(`▶`);
            await msg.react(`🔴`);

            let collector = msg.createReactionCollector((react, user) => ["◀","▶", "🔴"].some(e => e == react.emoji.name) && user.id == message.member.id, {
                time: 200000
            });

            collector.on("collect", (react, user) => {
                if(react.emoji.name == "▶"){
                    if(liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit(new Discord.MessageEmbed()
                    .setDescription(`${message.guild.name} sunucunda ${victim} kullanıcısının tüm cezaları aşağıda listenmiştir. Cezaların hiçbiri silinmemektedir, aktif olmayan cezaların yanında :x: aktif olanların yanında ✔ işareti vardır.`)
                    .addField(`Cezalar`, `${newList} ** **`)
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true})));
                }
                if(react.emoji.name == "◀"){
                    if(liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit(new Discord.MessageEmbed()
                    .setDescription(`${message.guild.name} sunucunda ${victim} kullanıcısının tüm cezaları aşağıda listenmiştir. Cezaların hiçbiri silinmemektedir, aktif olmayan cezaların yanında :x: aktif olanların yanında ✔ işareti vardır.`)
                    .addField(`Cezalar`, `${newList} ** **`)
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true})));
                }
                if(react.emoji.name == "🔴"){
                    msg.delete();
                    collector.stop();
                }
            })
        }
    });
}

module.exports.settings = {
    Commands: ["sicil"],
    Usage: "",
    Description: "",
    Activity: true
}