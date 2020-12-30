const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Models/Database/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let users = await User.find().sort({Coin: -1}).limit(15).exec();

    message.channel.send(new MessageEmbed()
        .setDescription(users.map((user, index) => `\`${index + 1}.\` <@${user.Id}>: **${user.Coin}** puan`).join("\n")));
}

module.exports.settings = {
    Commands: ["topcoin"],
    Usage: "topcoin",
    Description: "En çok puana sahip olan kullanıcıları listeler.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}