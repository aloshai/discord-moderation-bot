const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Stat = require("../../Utils/Schemas/Stat");

const TimeManager = require("../../Utils/Managers/TimeManager");
const tm = new TimeManager();

const moment = require("moment");
require("moment-duration-format");

const ChartManager = require("../../Utils/Managers/ChartManager");
const { startSession } = require("mongoose");
const cm = new ChartManager();


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

    let data = await Stat.find({}).sort({ Message: "" }).limit(5);
    if (!data) data = {};
    let day = await tm.getDay(message.guild.id);

    let obj = {
        Message:{
            $exists: true
        }
    };

    

    for (let index = 1; index <= day; index++) {
        obj.Message[index] = {

        }
    }

    Stat.find({
        $where: () => {
            
        },
        Message:{
            $exists: true
            [`${day}`]
        }
    })

}

module.exports.settings = {
    Commands: ["topmessages"],
    Usage: "",
    Description: "",
    Activity: true
}