const {VoiceState, Collection} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Group = require("../../Utils/Models/Group");

/**
 * @type {Collection<String, Group>}
 */
const Groups = new Collection();

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = (oldState, newState) => {
    if(oldState.member.user.bot) return;

    if(!oldState.channelID && newState.channelID){
        let group = getGroup(newState.channelID);
        group.addUser(newState.id);
        return;
    }

    if(oldState.channelID && newState.channelID){
        let oldGroup = getGroup(oldState.channelID);
        let newGroup = getGroup(newState.channelID);

        if(oldGroup){
            oldGroup.removeUser(oldState.id);
            if(oldGroup.Users.length <= 0) Groups.delete(oldState.channelID);
        }
        if(newGroup){
            newGroup.addUser(newState.id);
        }
    }
	
    else if(oldState.channelID && !newState.channelID){
        let group = getGroup(newState.channelID);
        group.removeUser(oldState.id);

        if(group.Users.length <= 0) Groups.delete(oldState.channelID);
    }
};

module.exports.config = {
    Event: "voiceStateUpdate"
};

/**
 * 
 * @param {String} id 
 */
function getGroup(id){
    let group = Groups.get(id);
    if(!group){
        group = new Group([], 500);
        Groups.set(id, group);
    }
    return group;
}