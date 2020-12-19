const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");

const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || (args[0] ? await client.users.getUser(args[0]) : undefined) || message.author;
    message.channel.csend(new MessageEmbed()
        .setThumbnail(victim.avatarURL({ dynamic: true }))
        .setDescription(`**Kullanıcı Adı:** \`${victim.tag}\`\n**ID:** \`${victim.id}\`\n**Bot mu?** \`${victim.bot ? "Evet." : "Hayır."}\`\n**Hesap Oluşturulma Tarihi:**\`${moment(victim.createdTimestamp).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}\``)
        .setFooter(`${message.author.tag} | Tarafından istendi.`));
}

module.exports.settings = {
    Commands: ["user", "kullanıcı", "kullanici"],
    Usage: "user <mention|id>",
    Description: "Etiketlediğin ya da ID'sini belirttiğin kişinin Discord profili hakkında detaylı bir bilgi alırsın.",
    Category: "Info",
    cooldown: 60000,
    Activity: true
}