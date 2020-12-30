const {Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const StatsManager = require("../../Managers/StatsManager");

// TODO: Çok fazla veri olduğunda bellekte fazla yer kaplayacak. Güncelleme kontrolü yapacağız.

const cooldowns = new Map();

/**
 * @param {Message} message 
 */
module.exports = (message) => {
    if(message.author.bot || message.channel.type != "text" || Settings.Stats.Message.BypassChannels.includes(message.channel.id)) return;
    if(cooldowns.has(message.author.id)){
        let data = cooldowns.get(message.author.id);

        let timePass = Date.now() - data.Time;
        if((timePass / 1000) < Settings.Stats.Message.Cooldown) return;
    }

    StatsManager.addMessageStat(message.author.id, message.channel.id, 1);
    cooldowns.set(message.author.id, {
        Time: Date.now()
    });
};

module.exports.config = {
    Event: "message"
};