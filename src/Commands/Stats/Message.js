const {Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const Stat = require("../../Utils/Schemas/Stat");

var webshot = require("node-webshot");
var fs = require("fs");

const TimeManager = require("../../Utils/Managers/TimeManager");
const { dirname } = require("path");
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
    .setFooter(`${message.guild.name} sunucusuda ${victim.username} kişisinin bilgileri.`)

    let data = await Stat.findOne({Id: victim.id});
    if(!data) data = {};
    let day = await tm.getDay(message.guild.id);
    embed.setDescription(`${victim} kişisinin ${day} gün boyunca yapmış olduğu mesaj aktifliği aşağıda detaylı olarak sıralanmıştır. Bir önceki güne gitmek için yöneticiye başvurunuz.`);
    embed.setColor("2f3136");
    if(data.Message){
        let günlükmesaj = 0, haftalıkmesaj = 0, aylıkmesaj = 0, toplammesaj = 0;
        let days = Object.keys(data.Message);

        let haftalık = {}, aylık = {}, günlük = {};

        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x,y) => x + y, 0);
            toplammesaj += sum;
            if(day == Number(_day)) {
                günlükmesaj += sum;
                günlük = Object.keys(data.Message[_day]).map(e => Object.assign({Channel: e, Value: data.Message[_day][e]}));
            }
            if(_day <= 7){
                haftalıkmesaj += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if(haftalık[key]) haftalık[key] += data.Message[_day][key];
                    else haftalık[key] =  data.Message[_day][key];
                });
            }
            if(_day <= 30) {
                aylıkmesaj += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if(aylık[key]) haftalık[key] += data.Message[_day][key];
                    else aylık[key] =  data.Message[_day][key];
                });
            }
        });
        embed.addField("**Günlük Mesaj İstatistiği**", `
        __Toplam:__ ${günlükmesaj} mesaj

        ${günlük.sort((x, y) => y.Value - x.Value).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data.Channel);
            return `\`${index + 1}.\` #${channel ? channel.name : "deleted-channel"}: \`${data.Value} mesaj\``;
        }).join("\n")}
        `);

        embed.addField("**Haftalık Mesaj İstatistiği**", `
        __Toplam:__ ${haftalıkmesaj} mesaj

        ${Object.keys(haftalık).sort((x, y) => haftalık[y] - haftalık[x]).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data);
            return `\`${index + 1}.\` #${channel ? channel.name : "deleted-channel"}: \`${haftalık[data]} mesaj\``;
        }).join("\n")}
        `);

        embed.addField("**Aylık Mesaj İstatistiği**", `
        __Toplam:__ ${haftalıkmesaj} mesaj

        ${Object.keys(aylık).sort((x, y) => aylık[y] - aylık[x]).splice(0, 5).map((data, index) => {
            let channel = message.guild.channels.cache.get(data);
            return `\`${index + 1}.\` #${channel ? channel.name : "deleted-channel"}: \`${aylık[data]} mesaj\``;
        }).join("\n")}
        `);

        var fs = require('fs'),
            path = require('path'),
            filePath = path.join(__dirname, 'test.html');

        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {

            } else {
                webshot(data,path.join(__dirname, 'helloworld.png'), {siteType:'html',   screenSize: {
                    width: 600
                  , height: 260
                  }}, function(err) {
                    message.channel.send(new MessageAttachment(path.join(__dirname, 'helloworld.png')));
                });    
            }
        });

        embed.addField(`Genel Mesaj İstatistiği`, `
        __Toplam:__ ${toplammesaj} mesaj

        Günlük: \`${günlükmesaj} mesaj\`
        Haftalık: \`${haftalıkmesaj} mesaj\`
        Aylık: \`${aylıkmesaj} mesaj\`
        `, true)
    }
    else{
        embed.setDescription("Herhangi bir kayıt bulunamadı.");
    }

    message.channel.csend(embed);
}

module.exports.settings = {
    Commands: ["messagestats", "mesajlar"],
    Usage: "",
    Description: "",
    Activity: true
}