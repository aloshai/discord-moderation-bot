const {VoiceState} = require("discord.js");

const pm = require("../../Managers/PenalManager");

// TODO: KONTROL EDİLECEK.

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = async (oldState, newState) => {
    if(oldState.channelID && !newState.channelID) return;
    if(!oldState.serverMute && newState.serverMute) return;
    let penals = await pm.getPenals({User: oldState.id, Activity: true, $or: [{Type: pm.Types.TEMP_VOICE_MUTE}, {Type: pm.Types.VOICE_MUTE}]});
    if(penals.length <= 0) return;

    if(newState.member && newState.member.manageable) newState.setMute(true).catch(console.error);
};

module.exports.config = {
    Event: "voiceStateUpdate"
};