const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");

const StatsManager = require("../../Managers/StatsManager");
const Stat = require("../../Models/Database/Stat");

const TimeManager = require("../../Managers/TimeManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (message.author.id != message.guild.ownerID) return message.reply("yetkin yok");


    await TimeManager.setToday(message.guild.id);
    await StatsManager.resetVoiceStat();
    await StatsManager.resetMessageStat();
    await Stat.updateMany({}, { $set: { AllVoice: 0, AllMessage: 0 } }).exec();

    message.reply("işlem tamamlandı.");
}

module.exports.settings = {
    Commands: ["resetstats"],
    Usage: "resetstats",
    Description: "Tüm aktiviteleri sıfırlarsın.",
    cooldown: 10000,
    Category: "Stats",
    Activity: true
}