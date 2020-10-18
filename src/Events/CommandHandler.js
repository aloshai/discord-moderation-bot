const {Message} = require("discord.js");
const Settings = require("../Configuration/Settings.json");
const Config = require("../Configuration/Config.json");

// TODO: COOLDOWN EKLENECEK.

/**
 * 
 * @param {Message} message 
 */
module.exports = (message) => {
    if(message.author.bot || message.channel.type != "text" || !message.content.startsWith(Config.Prefix) /*|| message.member.roles.cache.has(Settings.Penals.Jail.Role) || message.member.roles.cache.has(Settings.Penals.Suspect.Role) || message.member.roles.cache.has(Settings.Roles.Unregistered)*/) return;
    let args = message.content.split(" ");
    let name = args[0];
    if(!name) return; 
    name = name.substring(Config.Prefix.length);
    args = args.splice(1).filter(arg => arg != " ");

    let command = global.Commands.find(command => command.settings.Commands.includes(name.toLocaleLowerCase()));
    if(command) command.execute(message.client, message, args);
}

module.exports.config = {
    Event: "message"
}