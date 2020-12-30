const { Message, Client, MessageEmbed } = require("discord.js");

const FriendShip = require("../../Models/Database/Friend");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let data = await FriendShip.findOne({Id: message.author.id});
    if(!data) return message.reply("s-sanırsam hiç arkadaşın yok 😳");

    let friends = Object.keys(data.Friends).sort((a, b) => data.Friends[b] - data.Friends[a]).splice(0, 15);

    let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setTimestamp();
    embed.setDescription(`Arkadaşlık sistemi sunucu içerisinde vakit geçirdiğin insanların/grupların seninle olan arkadaşlık puanlarını gösterir. Unutma ki buradaki puanlama sistemi tamamen matematiksel hesaplamalarla çalışır, arkadaşlarınla arandaki ilişkini bilemez.`);
    embed.addField("Arkadaşlarım", `${friends.map(friend => `<@${friend}>: **${data.Friends[friend].toFixed(2)}** puan`).join("\n")}`);
    message.channel.csend(embed);
}

module.exports.settings = {
    Commands: ["friends", "arkadaslarım", "ships", "ship", "friend"],
    Usage: "friends",
    Description: "Sunucu içerisinde kimlerle ya da hangi gruplarla daha sık vakit geçirdiğini görebileceğin bir sistem.",
    Category: "Ship",
    cooldown: 5000,
    Activity: true
}