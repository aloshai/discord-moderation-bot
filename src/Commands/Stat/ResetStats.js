const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");

const StatsManager = require("../../Utils/Managers/StatsManager");
const Stat = require("../../Utils/Schemas/Stat");

const TimeManager = require("../../Utils/Managers/TimeManager");

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
    Usage: "",
    Description: "",
    cooldown: 10000,
    Activity: true
}