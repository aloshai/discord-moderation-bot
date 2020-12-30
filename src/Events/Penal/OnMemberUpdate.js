const {GuildMember} = require("discord.js");

const pm = require("../../Managers/PenalManager");
const Settings = require("../../Configuration/Settings.json");

/**
 * 
 * @param {GuildMember} oldMember 
 * @param {GuildMember} newMember 
 */
module.exports = async (oldMember, newMember) => {
    if(oldMember.roles.cache.size == newMember.roles.cache.size) return;
    let penals = await pm.getPenals({User: oldMember.id, Activity: true});
    let inJail = penals.some(penal => penal.Type == pm.Types.TEMP_JAIL || penal.Type == pm.Types.JAIL);
    if(inJail) return pm.setRoles(newMember, Settings.Penals.Jail.Role);
    let addRoles = [];

    let muted = penals.some(penal => penal.Type == pm.Types.TEMP_MUTE || penal.Type == pm.Types.MUTE);
    if(muted && Settings.Penals.Mute.Role.length > 0) addRoles.push(Settings.Penals.Mute.Role); 
    let voicemuted = penals.some(penal => penal.Type == pm.Types.VOICE_MUTE || penal.Type == pm.Types.TEMP_VOICE_MUTE);
    if(voicemuted && Settings.Penals.VoiceMute.Role.length > 0 && Settings.Penals.VoiceMute.ManualMute == false) addRoles.push(Settings.Penals.VoiceMute.Role);
    if(addRoles.length > 0) newMember.roles.add(addRoles).catch();
}

module.exports.config = {
    Event: "guildMemberUpdate"
}