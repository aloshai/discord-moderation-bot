const {Message, Client, MessageEmbed} = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || (args[0] ? await client.users.getUser(args[0]) : undefined) || message.author;
    
    message.channel.csend(new MessageEmbed()
    .setImage(victim.avatarURL({dynamic: true}))
    .setDescription(`[URL ADRESI](${victim.avatarURL({dynamic: true})})`)
    .setFooter(`${message.author.tag} | Tarafından istendi.`));
}

module.exports.settings = {
    Commands: ["avatar", "pp"],
    Usage: "",
    Description: "",
    cooldown: 10000,
    Activity: true
}