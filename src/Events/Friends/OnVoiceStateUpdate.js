const {VoiceState, Collection} = require("discord.js");
const Group = require("../../Models/Group");

/**
 * @type {Collection<String, Group>}
 */
const Groups = global.Groups = new Collection();

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = async (oldState, newState) => {
    if(oldState.member.user.bot) return;

    if(!oldState.channelID && newState.channelID){
        let group = getGroup(newState.channelID);
        group.addUser(newState.id);
    }

    else if(oldState.channelID && newState.channelID){
        let oldGroup = getGroup(oldState.channelID);
        let newGroup = getGroup(newState.channelID);

        if(oldState.channelID != newState.channelID){
            if(oldGroup){
                oldGroup.removeUser(oldState.id);
                if(oldGroup.Users.length <= 0) Groups.delete(oldState.channelID);
            }
            if(newGroup && !newGroup.checkUser(newState.id)) newGroup.addUser(newState.id);
        }
        else oldGroup.updateUsers();
    }
	
    else if(oldState.channelID && !newState.channelID){
        let group = getGroup(oldState.channelID);
        if(!group) return;
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
        group = new Group([], 10);
        Groups.set(id, group);
    }
    return group;
}