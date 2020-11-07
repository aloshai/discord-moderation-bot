const {Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const sm = require("../../Utils/Managers/StatsManager");

// TODO: Çok fazla veri olduğunda bellekte fazla yer kaplayacak. Güncelleme kontrolü yapacağız.

const cooldowns = new Map();

/**
 * @param {Message} message 
 */
module.exports = (message) => {
    if(message.author.bot || message.channel.type != "text" || Settings.Stats.Message.BypassChannels.includes(message.channel.id)) return;
    console.log(sm.addMessageStat);
    if(cooldowns.has(message.author.id)){
        let data = cooldowns.get(message.author.id);

        let geçenZaman = Date.now() - data.Time;
        if((geçenZaman / 1000) < Settings.Stats.Message.Cooldown) return;
    }

    sm.addMessageStat(message.author.id, message.channel.id, 1);
    cooldowns.set(message.author.id, {
        Time: Date.now()
    });
};

module.exports.config = {
    Event: "message"
};