const { Message, Client, MessageEmbed } = require("discord.js");

const Invite = require("../../Models/Database/Invite");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.users.first() || message.author;

    let data = await Invite.findOne({Id: victim.id}) || {Regular: 0, Leave: 0, Inviter: undefined, Bonus: 0,Fake: 0 };
    message.channel.csend(new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
    .setDescription(`Toplam: ${data.Regular + data.Bonus}, Gerçek: ${data.Regular}, Sahte: ${data.Fake}, Çıkan: ${data.Leave}`));
}

module.exports.settings = {
    Commands: ["invite", "meinvite", "inviteme"],
    Usage: "coin",
    Description: "Üzerinde ne kadar puan olduğunu öğrenirsin.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}