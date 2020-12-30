const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Stat = require("../../Models/Database/Stat");
const Helper = require("../../Utils/Helper");

const tm = require("../../Managers/TimeManager");

const cm = require("../../Managers/ChartManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setFooter(`${message.guild.name} sunucusunun mesaj istatistikleri.`)
    let day = await tm.getDay(message.guild.id);
    embed.setDescription(`${message.guild.name} sunucusunda kullanıcıların **${day}** gün boyunca yapmış olduğu mesaj aktifliği aşağıda detaylı olarak sıralanmıştır. Bir önceki güne gitmek için yöneticiye başvurunuz.`);
    embed.setColor("2f3136");

    Stat.aggregate([
        {$project: {Voice: 0}},
        { $sort: { AllMessage: -1 } }
    ]).limit(10).exec(async (err, docs) => {
        if (err) return message.reply("bir hata ile karşılaşıldı.");
        let users = [], usersToEmbed = [];

        if (docs.length > 0) {
            for (let index = 0; index < docs.length; index++) {
                const doc = docs[index];
                let stat = doc;
                if (!stat) continue;

                if (stat.AllMessage <= 0) continue;

                if (stat.Message) {
                    let days = Object.keys(stat.Message);
                    let dataValues = new Array(day).fill(0);
                    days.forEach(_day => {
                        let sum = Object.values(stat.Message[_day]).reduce((x, y) => x + y, 0);
                        dataValues[_day - 1] = sum;
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
                    datasets: users
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: '#ffffff',
                            fontSize: 20
                        }
                    }
                }
            });
            embed.addField(`Top 10 Genel Mesaj İstatistiği`, usersToEmbed.map((val, index) => `\`${index + 1}.\` ${val.User}(${val.User.username}): \`${val.Value} mesaj\``).join("\n"))
            embed.setImage("attachment://Graph.png");
            let attachment = new MessageAttachment(buffer, "Graph.png");

            message.channel.csend({
                embeds: [embed],
                files: [attachment]
            });
        }
        else {
            embed.addField("VERI KAYDI YOK!", "** **");
            return message.csend(embed);
        }
    });
}

const colors = [
    'rgba(240, 255, 0, <f>)',
    'rgba(147, 255, 0, <f>)',
    'rgba(0, 255, 4, <f>)',
    'rgba(0, 255, 182, <f>)',
    'rgba(0, 240, 255, <f>)',
    'rgba(0, 124, 255, <f>)',
    'rgba(81, 0, 255, <f>)',
    'rgba(182, 0, 255, <f>)',
    'rgba(255, 0, 220, <f>)',
    'rgba(255, 0, 85, <f>)',
]
function getColor(index, x) {
    let color = colors[index].replace("<f>", x);
    return color;
}

module.exports.settings = {
    Commands: ["topmessages", "topmesajlar"],
    Usage: "topmessages",
    Description: "Sunucudaki mesaj sıralamasına bakarsın.",
    Category: "Stats",
    Activity: true,
    cooldown: 30000
}