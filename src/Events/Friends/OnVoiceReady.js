const Settings = require("../../Configuration/Settings.json");
const Group = require("../../Models/Group");
const client = global.Client;

module.exports = () => {
    let guild = client.guilds.cache.get(Settings.Server.Id);
    if(!guild) return;
    
    let channels = guild.channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0);
    channels.forEach(channel => {
        global.Groups.set(channel.id, new Group(channel.members.map(member => ({Id: member.id, LastUpdate: Date.now()})), 10));
    });
};

module.exports.config = {
    Event: "ready"
};