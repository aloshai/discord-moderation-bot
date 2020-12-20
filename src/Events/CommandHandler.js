const { Message } = require("discord.js");
const Settings = require("../Configuration/Settings.json");
const Config = require("../Configuration/Config.json");

const Cooldown = new Map();
setInterval(() => {
    Cooldown.forEach((cd, key) => {
        if ((Date.now() - cd.lastUsage) > cd.cooldown) Cooldown.delete(key);
    });
}, 5000);

/**
 * @param {Message} message 
 */
module.exports = (message) => {
    if (message.author.bot || message.channel.type == "dm" || !message.content.startsWith(Config.Prefix) || message.member.roles.cache.has(Settings.Penals.Jail.Role) || message.member.roles.cache.has(Settings.Penals.Suspect.Role) || message.member.roles.cache.has(Settings.Roles.Unregistered)) return;
    let args = message.content.split(" ").filter(arg => arg != " "), name = args[0];
    if (!name) return;
    name = name.substring(Config.Prefix.length);
    args = args.splice(1);

    let command = global.Commands.find(command => command.settings.Commands.includes(name.toLocaleLowerCase()));
    if (command) {
        if(!command.settings.Activity) return;
        if(!message.member.hasPermission("ADMINISTRATOR")){
            let cooldown = command.settings.cooldown || 1000;
            let cd = Cooldown.get(message.author.id) || [];
            if (cd.length > 0) {
                let element = cd.find(e => e.id == command.settings.id);
                if (element) {
                    let diff = (Date.now() - element.lastUsage);
                    if (diff < cooldown) return; //message.reply(`bu komutu tekrar kullanabilmek için **${Number(((cooldown - diff) / 1000).toFixed(2)).toHumanize({}, 1)} saniye** sonra tekrar dene.`);
                    element.lastUsage = Date.now();
                }
            }
            command.execute(message.client, message, args);
            cd.push({ id: command.settings.id, cooldown: cooldown, lastUsage: Date.now() });
            Cooldown.set(message.author.id, cd);    
        }
        else command.execute(message.client, message, args);
        //global.forceGC();
    }
}

module.exports.config = {
    Event: "message"
}