const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Stat = require("../../Utils/Schemas/Stat");
const HelperStat = require("../../Utils/Schemas/HelperStat");
const Helper = require("../../Utils/Helper");

const TimeManager = require("../../Utils/Managers/TimeManager");
const tm = new TimeManager();

const moment = require("moment");
require("moment-duration-format");

const ChartManager = require("../../Utils/Managers/ChartManager");
const cm = new ChartManager();

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setFooter(`${message.guild.name} sunucusunun ses istatistikleri.`)
    let day = await tm.getDay(message.guild.id);
    embed.setDescription(`${message.guild.name} sunucusunda kullanıcıların **${day}** gün boyunca yapmış olduğu ses aktifliği aşağıda detaylı olarak sıralanmıştır. Bir önceki güne gitmek için yöneticiye başvurunuz.`);
    embed.setColor("2f3136");

    HelperStat.aggregate([
        {$sort: {Voice: -1}}
    ]).limit(10).exec(async (err, docs) => {
        if(err) return message.reply("bir hata ile karşılaşıldı.");
        let users = [], usersToEmbed = [];

        if(docs.length > 0){
            for (let index = 0; index < docs.length; index++) {
                const doc = docs[index];
                let stat = await Stat.findOne({Id: doc.Id});
                if(!stat) continue;

                if(stat.Voice){
                    let days = Object.keys(stat.Voice);
                    let dataValues = new Array(day).fill(0);
                    days.forEach(_day => {
                        let sum = Object.values(stat.Voice[_day]).reduce((x, y) => x + y, 0);
                        dataValues[_day - 1] = (sum / (1000 * 60));
                    });
                    let user = (await Helper.GetUser(doc.Id));
                    usersToEmbed.push({
                        User: user,
                        Value: dataValues.reduce((x, y) => x + y, 0)
                    });
                    let borderColors = new Array(dataValues.length).fill(getColor(index, "0.8"));
                    let backgroundColors = new Array(dataValues.length).fill(getColor(index, "0.1"))
                    let pointBackgroundColors = new Array(dataValues.length).fill(getColor(index, "1"));
                    let data = {
                        label: `${user.username}`,
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        pointBackgroundColor: pointBackgroundColors,
                        borderWidth: 1.5,
                    };
                    users.push(data);
                }
            }

            let dataDate= [];
            for (let index = 0; index < day; index++) {
                let date = new Date(Date.now() - (1000 * 60 * 60 * 24 * (day - (index + 1)))).toDateString();
                dataDate.push(date);
            }

            let buffer = await cm.ImageFromData({
                width: 600,
                height: 290,
                type: 'line',
                data: {
                    labels: [].concat(dataDate),
                    datasets: users
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: '#ffffff',
                            fontSize: 20
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: (value) => '$' + value
                            }
                        }]
                    }
                }
            });
            embed.addField(`Top 10 Genel Ses İstatistiği`, usersToEmbed.map((val, index) => `\`${index + 1}.\` ${val.User}(${val.User.username}): \`${moment.duration(val.Value).format("H [saat, ] m [dakika]")}\``).join("\n"))
            embed.setImage("attachment://Graph.png");
            let attachment = new MessageAttachment(buffer, "Graph.png");

            message.channel.csend({
                embeds: [embed],
                files: [attachment]
            });    
        }
        else
        {
            embed.addField("VERI KAYDI YOK!", "** **");
            return message.csend(embed);
        }
    });
}

const colors = [
    'rgba(251, 255, 0, <f>)',
    'rgba(4, 255, 0, <f>)',
    'rgba(255, 0, 0, <f>)',
    'rgba(1, 242, 255, <f>)',
    'rgba(151, 0, 255, <f>)',
    'rgba(8, 0, 255, <f>)',
    'rgba(255, 131, 0, <f>)',
    'rgba(255, 0, 212, <f>)',
    'rgba(92, 0, 0, <f>)',
    'rgba(98, 1, 58, <f>)',
]
function getColor(index, x) {
    let color = colors[index].replace("<f>", x);
    return color;
}

module.exports.settings = {
    Commands: ["topvoices", "topvoices"],
    Usage: "",
    Description: "",
    Activity: true
}