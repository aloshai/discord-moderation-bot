const {Client, Message, MessageEmbed} = require("discord.js");
const Stat = require("../../Utils/Schemas/Stat");
const TimeManager = require("../../Utils/Managers/TimeManager");

const moment = require("moment");
require("moment-duration-format");

const tm = new TimeManager();


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    let embed = new MessageEmbed()
    .setAuthor(victim.username, victim.avatarURL({dynamic: true}))
    .setFooter("İstatistik bilgileri");

    let data = await Stat.findOne({Id: victim.id});
    if(!data) data = {};
    let day = await tm.getDay(message.guild.id);

    if(data.Message){
        let günlükmesaj = 0, haftalıkmesaj = 0, aylıkmesaj = 0, toplammesaj = 0;
        let days = Object.keys(data.Message);
        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x,y) => x + y, 0);
            toplammesaj += sum;
            if(day == Number(_day)) günlükmesaj += sum;
            if(_day <= 7) haftalıkmesaj += sum;
            if(_day <= 30) aylıkmesaj += sum;
        });
        embed.addField(`Mesaj İstatistiği`, `
        __Toplam:__ \`${toplammesaj} mesaj\`

        Günlük: \`${günlükmesaj} mesaj\`
        Haftalık: \`${haftalıkmesaj} mesaj\`
        Aylık: \`${aylıkmesaj} mesaj\`
        `, true)
    }

    if(data.Voice){
        let günlükses = 0, haftalıkses = 0, aylıkses = 0, toplamses = 0;
        let days = Object.keys(data.Voice);
        days.forEach(_day => {
            let sum = Object.values(data.Voice[_day]).reduce((x,y) => x + y, 0);
            toplamses += sum;
            if(day == Number(_day)) günlükses += sum;
            if(_day <= 7) haftalıkses += sum;
            if(_day <= 30) aylıkses += sum;
        });
        embed.addField(`Ses İstatistiği`, `
        __Toplam:__ \`${moment.duration(toplamses).format("H [saat, ] m [dakika]")}\`

        Günlük: \`${moment.duration(günlükses).format("H [saat, ] m [dakika]")}\`
        Haftalık: \`${moment.duration(haftalıkses).format("H [saat, ] m [dakika]")}\`
        Aylık: \`${moment.duration(aylıkses).format("H [saat, ] m [dakika]")}\`
        `, true)
    }
    message.channel.send(embed);
}

module.exports.settings = {
    Commands: ["stats", "istatistik"],
    Usage: "",
    Description: "",
    Activity: true
}