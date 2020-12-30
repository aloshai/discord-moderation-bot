const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Stat = require("../../Models/Database/Stat");
const tm = require("../../Managers/TimeManager");

const moment = require("moment");
require("moment-duration-format");

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
        .setFooter("İstatistik bilgileri");

    let data = await Stat.findOne({ Id: victim.id });
    if (!data) data = {};
    let day = await tm.getDay(message.guild.id);

    let dataMessage = new Array(day).fill(0, 0, day), dataVoice = new Array(day).fill(0, 0, day), dataColors = new Array(day).fill('rgba(0, 92, 210, 0.5)');

    if (data.Message) {
        let günlükmesaj = 0, haftalıkmesaj = 0, aylıkmesaj = 0, toplammesaj = 0;
        let days = Object.keys(data.Message);
        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x, y) => x + y, 0);
            toplammesaj += sum;
            dataMessage[_day - 1] = sum;
            if (day == Number(_day)) günlükmesaj += sum;
            if (_day <= 7) haftalıkmesaj += sum;
            if (_day <= 30) aylıkmesaj += sum;
        });
        embed.addField(`Mesaj İstatistiği`, `
        __Toplam:__ \`${toplammesaj} mesaj\`

        Günlük: \`${günlükmesaj} mesaj\`
        Haftalık: \`${haftalıkmesaj} mesaj\`
        Aylık: \`${aylıkmesaj} mesaj\`
        `, true)
    }
    if (data.Voice) {
        let günlükses = 0, haftalıkses = 0, aylıkses = 0, toplamses = 0;
        let days = Object.keys(data.Voice);
        let max = Math.max(dataMessage);
        days.forEach(_day => {
            let sum = Object.values(data.Voice[_day]).reduce((x, y) => x + y, 0);
            if (isNaN(sum)) sum = 0;
            toplamses += sum;

            dataVoice[_day - 1] = (sum / (1000 * 60))
            if (day == Number(_day)) günlükses += sum;
            if (_day <= 7) haftalıkses += sum;
            if (_day <= 30) aylıkses += sum;
        });
        embed.addField(`Ses İstatistiği`, `
        __Toplam:__ \`${moment.duration(toplamses).format("H [saat, ] m [dakika]")}\`

        Günlük: \`${moment.duration(günlükses).format("H [saat, ] m [dakika]")}\`
        Haftalık: \`${moment.duration(haftalıkses).format("H [saat, ] m [dakika]")}\`
        Aylık: \`${moment.duration(aylıkses).format("H [saat, ] m [dakika]")}\`
        `, true)
    }

    let dataDate = [];
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
                data: [].concat(dataMessage),
                backgroundColor: [
                    'rgba(0, 112, 255, 0.25)'
                ],
                borderColor: [].concat(dataColors),
                borderWidth: 1
            },
            {
                label: "Toplam Ses İstatistiği (Dakika)",
                data: dataVoice,
                backgroundColor: [
                    'rgba(4, 255, 0, 0.25)'
                ],
                borderColor: [].concat(new Array(day).fill('rgba(4, 255, 0, 0.5)')),
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
    Commands: ["stats", "istatistik", "stat"],
    Usage: "stats [@user|id]",
    Description: "Sunucudaki genel ses ve mesaj istatistiğinle alakalı bilgi alırsın.",
    Category: "Stats",
    Activity: true,
    cooldown: 20000
}