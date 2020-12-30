const {VoiceState, Collection} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const sm = require("../../Managers/StatsManager");

const Voices = global.Voices = new Collection();

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = (oldState, newState) => {
    if(oldState.member.user.bot) return;

    if(!oldState.channelID && newState.channelID && !Settings.Stats.Voice.BypassChannels.includes(newState.channelID)){
        return Voices.set(oldState.id, {
            Time: Date.now(),
            ChannelID: newState.channelID
        });
    }

    if(!Voices.has(oldState.id)) Voices.set(oldState.id, {
        Time: Date.now(),
        ChannelID: (oldState.channelID || newState.channelID)
    });

    if(oldState.channelID && newState.channelID && !Settings.Stats.Voice.BypassChannels.includes(newState.channelID)){
        let data = Voices.get(oldState.id);
        Voices.set(oldState.id, {
            Time: Date.now(),
            ChannelID: newState.channelID
        });

        let duration = Date.now() - data.Time;
        return sm.addVoiceStat(oldState.id, data.ChannelID, duration);
    }
	
    else if(oldState.channelID && !newState.channelID && !Settings.Stats.Voice.BypassChannels.includes(oldState.channelID)){
        let data = Voices.get(oldState.id);
        Voices.delete(oldState.id);
        let duration = Date.now() - data.Time;
        return sm.addVoiceStat(oldState.id, data.ChannelID, duration);
    }
};

module.exports.config = {
    Event: "voiceStateUpdate"
};