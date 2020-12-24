const { VoiceState } = require("discord.js");
const SettingsJSON = require("../../Configuration/Settings.json");

const Settings = SettingsJSON.PrivHub;

/**
 * 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState
 */
module.exports = async (oldState, newState) => {
    let mainChannel = oldState.guild.channels.cache.get(Settings.Room);
    if (!mainChannel) return;

    if (!oldState.channelID && (newState.channelID && newState.channel.parentID == mainChannel.parentID && newState.channelID == mainChannel.id)) {
        newState.guild.channels.create(`${Settings.Symbol} ${newState.member.displayName}'s Nature`, {
            type: "voice",
            parent: mainChannel.parentID,
            permissionOverwrites: mainChannel.permissionOverwrites.clone().set(newState.member.id, {
                id: newState.member.id,
                allow: ["MANAGE_CHANNELS"]
            })
        }).then((channel) => {
            if (newState.member && newState.member.voice.channelID) newState.member.voice.setChannel(channel);
        });
        return;
    }
    else if (oldState.channelID && newState.channelID) {
        let oldChannel = oldState.channel;
        if (oldChannel.position > mainChannel.position && oldChannel.parentID == mainChannel.parentID && oldChannel.members.size <= 0 && !oldChannel.deleted) oldChannel.delete().catch(undefined);
        if (newState.channelID == mainChannel.id && newState.channel.parentID == mainChannel.parentID) {
            newState.guild.channels.create(`${Settings.Symbol} ${newState.member.displayName}'s Nature`, {
                type: "voice",
                parent: mainChannel.parentID,
                permissionOverwrites: mainChannel.permissionOverwrites.clone().set(newState.member.id, {
                    id: newState.member.id,
                    allow: ["MANAGE_CHANNELS"]
                })
            }).then((channel) => {
                if (newState.member && newState.member.voice.channelID) newState.member.voice.setChannel(channel);
            });
        }
        return;
    }
    else if ((oldState.channelID && oldState.channel.parentID == mainChannel.parentID) && !newState.channelID) {
        let oldChannel = oldState.channel;
        if (oldChannel.position > mainChannel.position && oldChannel.members.size <= 0 && !oldChannel.deleted) oldChannel.delete().catch(undefined);
    }
}

module.exports.config = {
    Event: "voiceStateUpdate"
}