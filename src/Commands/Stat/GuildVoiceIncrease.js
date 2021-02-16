const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Guild = require("../../Models/Database/Guild");

const tm = require("../../Managers/TimeManager");
const cm = require("../../Managers/ChartManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let data = await Guild.findOne({ Id: message.guild.id }, { "Stats.VoiceIncrease": 1 });
    if(data.Stats.VoiceIncrease){
        let day = await tm.getDay(message.guild.id);
        let chartDates = [], chartValues = new Array(day).fill(0);

        for (let index = 0; index < day; index++) chartDates.push(new Date(Date.now() - (1000 * 60 * 60 * 24 * (day - (index + 1)))).toTurkishFormatDate());

        let voiceData = data.Stats.VoiceIncrease;
        let days = Object.keys(voiceData);
        days.forEach(_day => {
            let sum = Object.values(voiceData[_day]).reduce((x, y) => x + y, 0);
            chartValues[_day - 1] = sum;
        });

        let buffer = await cm.ImageFromData({
            width: 600,
            height: 290,
            type: 'line',
    
            data: {
                labels: [].concat(chartDates),
                datasets: [{
                    label: "Toplam Mesaj İstatistiği (adet)",
                    data: [].concat(chartValues),
                    backgroundColor: [
                        'rgba(0, 112, 255, 0.25)'
                    ],
                    borderColor: [].concat(new Array(day).fill('rgba(0, 92, 210, 0.5)')),
                    borderWidth: 1
                }]
            }
        });
    
        let attachment = new MessageAttachment(buffer, "Graph.png");
        message.channel.csend({
            files: [attachment]
        });
    }
    else message.reply("kayıtlı hiçbir veri bulunmamaktadır.");
}

module.exports.settings = {
    Commands: ["gvi", "guildvoiceincrease"],
    Usage: "gvi",
    Description: "Sunucudaki aktifliğin nasıl sürdürüldüğüne bakarsın.",
    Category: "Stats",
    Activity: false,
    cooldown: 15000
}