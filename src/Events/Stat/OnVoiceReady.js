const Settings = require("../../Configuration/Settings.json");
const StatsManager = require("../../Utils/Managers/StatsManager");
const sm = new StatsManager();
const client = global.Client;

module.exports = () => {
    let guild = client.guilds.cache.get(Settings.Server.Id);
    if(!guild) return;
    
    let channels = guild.channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0 && !Settings.Stats.Voice.BypassChannels.includes(channel.id));
    channels.forEach(channel => {
        let members = channel.members;
        members.forEach(member => {
            global.Voices.set(member.id, {
                ChannelID: channel.id,
                Time: Date.now()
            });
        });
    });

    setInterval(() => {
        check();
    }, 10000);
};

module.exports.config = {
    Event: "ready"
};

function check(){
    let voices = global.Voices;
    voices.each((value, key) => {
        voices.set(key, {
            ChannelID: value.ChannelID,
            Time: Date.now()
        });
        sm.addVoiceStat(key, value.ChannelID, Date.now() - value.Time);
    });
}