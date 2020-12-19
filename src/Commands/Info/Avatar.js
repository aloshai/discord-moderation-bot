const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || (args[0] ? await client.users.getUser(args[0]) : undefined) || message.author;

    message.channel.csend(new MessageEmbed()
        .setImage(victim.avatarURL({ dynamic: true }))
        .setDescription(`[URL ADRESI](${victim.avatarURL({ dynamic: true })})`)
        .setFooter(`${message.author.tag} | Tarafından istendi.`));
}

module.exports.settings = {
    Commands: ["avatar", "pp"],
    Usage: "avatar <member/id>",
    Description: "Etiketlediğin kişinin Discord'daki profil fotoğrafını birçok formatta alırsın ve indirebilir duruma getirirsin.",
    Category: "Info",
    cooldown: 20000,
    Activity: true
}