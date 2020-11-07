const {GuildMember} = require("discord.js");

const pm = require("../../Utils/Managers/PenalManager");
const Settings = require("../../Configuration/Settings.json");

/**
 * 
 * @param {GuildMember} oldMember 
 * @param {GuildMember} newMember 
 */
module.exports = async (oldMember, newMember) => {
    if(oldMember.roles.cache.size == newMember.roles.cache.size) return;

    let roles = oldMember.roles.cache.filter(e => !newMember.roles.cache.has(e.id));
    if(!roles.has(Settings.Penals.Jail.Role) && !roles.has(Settings.Penals.Mute.Role) && !roles.has(Settings.Penals.Suspect.Role)) return;

    let penals = await pm.getPenals({User: oldMember.id, Activity: true});

    let inJail = penals.some(penal => penal.Type == PenalManager.Types.TEMP_JAIL || penal.Type == PenalManager.Types.JAIL);
    if(inJail) return pm.setRoles(newMember, Settings.Penals.Jail.Role);

    let addRoles = [];

    let muted = penals.some(penal => penal.Type == PenalManager.Types.TEMP_MUTE || penal.Type == PenalManager.Types.MUTE);
    if(muted && Penals.Mute.Role.length > 0) addRoles.push(Settings.Penals.Mute.Role); 

    let voicemuted = penals.some(penal => penal.Type == PenalManager.Types.VOICE_MUTE || penal.Type == PenalManager.Types.TEMP_VOICE_MUTE);
    if(voicemuted && Penals.VoiceMute.Role.length > 0 && Penals.VoiceMute.ManualMute === false) addRoles.push(Settings.Penals.VoiceMute.Role);
    
    if(addRoles.length > 0) newMember.roles.add(addRoles).catch();
}

module.exports.config = {
    Event: "guildMemberUpdate"
}