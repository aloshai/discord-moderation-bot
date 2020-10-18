const Settings = require("../../Configuration/Settings.json");

const PenalManager = require("../../Utils/Managers/PenalManager");
const Penal = require("../../Utils/Schemas/Penal");
const pm = new PenalManager();
const client = global.Client;

module.exports = async() => {
    setInterval(() => {
        checkPenals();
    }, 60*10000)
}

module.exports.config = {
    Event: "ready"
}

async function checkPenals() {
    return;
    let guild = client.guilds.cache.get(Settings.Server.Id);
    if(!guild) return;
    let penals = await pm.getPenals({Activity: true});

    let finishPenals = penals.filter(penal => penal.Temporary && Date.now() > penal.FinishTime);

    finishPenals.forEach(async penal => {
        penal.Activity = false;
        let member = guild.member(penal.User) || await guild.members.fetch(penal.User).catch(e => undefined);
        if(!member) return;
        if(penal.Type == PenalManager.Types.JAIL || penal.Type == PenalManager.Types.TEMP_JAIL) pm.setRoles(member, Settings.Roles.Unregistered);
        else if(penal.Type == PenalManager.Types.MUTE || penal.Type == PenalManager.Types.TEMP_MUTE) member.roles.remove(Settings.Penals.Mute.Role);
        else if(penal.Type == PenalManager.Types.VOICE_MUTE || penal.Type == PenalManager.Types.TEMP_VOICE_MUTE){
            member.roles.remove(Settings.Penals.VoiceMute.Role);
            if(member.voice.channelID) member.voice.setMute(false).catch();
        }
    });
    Penal.updateMany({Activity: true, FinishTime: {$exists: true, $lte: Date.now()}}, {$set: {Activity: false}}, {multi: true}).exec();

    penals = penals.filter(penal => penal.Activity);
    penals.forEach(async penal => {
        let member = guild.member(penal.User) || await guild.members.fetch(penal.User).catch(e => undefined);
        if(!member) return;
        
        if((penal.Type == PenalManager.Types.TEMP_JAIL || penal.Type == PenalManager.Types.JAIL) && !member.roles.cache.has(Settings.Penals.Jail.Role)){
            pm.setRoles(member, Settings.Penals.Jail.Role);
        }
        else if((penal.Type == PenalManager.Types.MUTE || penal.Type == PenalManager.Types.TEMP_MUTE) && !member.roles.cache.has(Settings.Penals.Mute.Role)) member.roles.add(Settings.Penals.Mute.Role);
        else if((penal.Type == PenalManager.Types.VOICE_MUTE || penal.Type == PenalManager.Types.TEMP_VOICE_MUTE) && (!member.roles.cache.has(Settings.Penals.VoiceMute.Role) || !member.voice.serverMute)){
            member.roles.remove(Settings.Penals.VoiceMute.Role);
            if(member.voice.channelID) member.voice.setMute(false).catch();
        }
    });
}