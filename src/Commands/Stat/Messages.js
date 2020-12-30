const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Stat = require("../../Models/Database/Stat");

const tm = require("../../Managers/TimeManager");

const cm = require("../../Managers/ChartManager");


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    let embed = new MessageEmbed()
        .setAuthor(victim.username, victim.avatarURL({ dynamic: true }))
        .setFooter(`${message.guild.name} sunucusuda ${victim.username} kişisinin bilgileri.`)

    let data = await Stat.findOne({ Id: victim.id }, {Voice: 0});
    if (!data) data = {};
    let day = await tm.getDay(message.guild.id);
    embed.setDescription(`${victim} kişisinin ${day} gün boyunca yapmış olduğu mesaj aktifliği aşağıda detaylı olarak sıralanmıştır. Bir önceki güne gitmek için yöneticiye başvurunuz.`);
    embed.setColor("2f3136");

    let dataValue = new Array(day).fill(0);
    let dataDate = [];
    let dataColors = new Array(day).fill('rgba(0, 92, 210, 0.5)');

    if (data.Message) {
        let günlükmesaj = 0, haftalıkmesaj = 0, aylıkmesaj = 0, toplammesaj = 0;
        let days = Object.keys(data.Message);

        let haftalık = {}, aylık = {}, günlük = [];

        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x, y) => x + y, 0);
            toplammesaj += sum;
            dataValue[_day - 1] = sum;

            if (day == Number(_day)) {
                günlükmesaj += sum;
                günlük = Object.keys(data.Message[_day]).map(e => Object.assign({ Channel: e, Value: data.Message[_day][e] }));
            }
            if (_day <= 7) {
                haftalıkmesaj += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if (haftalık[key]) haftalık[key] += data.Message[_day][key];
                    else haftalık[key] = data.Message[_day][key];
                });
            }
            if (_day <= 30) {
                aylıkmesaj += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if (aylık[key]) aylık[key] += data.Message[_day][key];
                    else aylık[key] = data.Message[_day][key];
                });
            }
        });
        embed.addField("**Günlük Mesaj İstatistiği**", `
        __Toplam:__ ${günlükmesaj} mesaj

        ${günlük.sort((x, y) => y.Value - x.Value).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data.Channel);
            return `\`${index + 1}.\` ${channel ? channel : "deleted-channel"}: \`${data.Value} mesaj\``;
        }).join("\n")}\n\n** **
        `);

        embed.addField("**Haftalık Mesaj İstatistiği**", `
        __Toplam:__ ${haftalıkmesaj} mesaj

        ${Object.keys(haftalık).sort((x, y) => haftalık[y] - haftalık[x]).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data);
            return `\`${index + 1}.\` ${channel ? channel : "deleted-channel"}: \`${haftalık[data]} mesaj\``;
        }).join("\n")}\n\n** **
        `);

        embed.addField("**Aylık Mesaj İstatistiği**", `
        __Toplam:__ ${haftalıkmesaj} mesaj

        ${Object.keys(aylık).sort((x, y) => aylık[y] - aylık[x]).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data);
            return `\`${index + 1}.\` ${channel ? channel : "deleted-channel"}: \`${aylık[data]} mesaj\``;
        }).join("\n")}\n\n** **
        `);

        embed.addField(`Genel Mesaj İstatistiği`, `
        __Toplam:__ ${toplammesaj} mesaj

        Günlük: \`${günlükmesaj} mesaj\`
        Haftalık: \`${haftalıkmesaj} mesaj\`
        Aylık: \`${aylıkmesaj} mesaj\`
        `, true)
    }
    else {
        embed.setDescription("Herhangi bir kayıt bulunamadı.");
    }

    for (let index = 0; index < day; index++) {
        let date = new Date(Date.now() - (1000 * 60 * 60 * 24 * (day - (index + 1))));
        dataDate.push(date.toTurkishFormatDate());
    }

    let buffer = await cm.ImageFromData({
        width: 600,
        height: 290,
        type: 'line',

        data: {
            labels: [].concat(dataDate),
            datasets: [{
                label: "Toplam Mesaj İstatistiği (Adet)",
                data: [].concat(dataValue),
                backgroundColor: [
                    'rgba(0, 112, 255, 0.25)'
                ],
                borderColor: [].concat(dataColors),
                borderWidth: 1
            }]
        },
        options: {

        }
    });

    embed.setImage("attachment://Graph.png");
    let attachment = new MessageAttachment(buffer, "Graph.png");

    message.channel.csend({
        embeds: [embed],
        files: [attachment]
    });
}
module.exports.settings = {
    Commands: ["messagestats", "mesajlar", "mesaj"],
    Usage: "messagestats",
    Description: "Sunucudaki mesaj istatistiğinle alakalı bilgi alırsın.",
    Category: "Stats",
    Activity: true,
    cooldown: 15000
}