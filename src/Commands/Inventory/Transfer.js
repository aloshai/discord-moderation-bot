const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

const User = require("../../Models/Database/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let value = Number(args[1]);
    if(isNaN(value)) return message.reply(`sadece sayı girebilirsin!`);
    value = value.toFixed(0);

    if(value <= 0) return message.reply("girdiğin sayı 0'dan küçük olamaz.");

    let victim = message.mentions.users.first();
    if(!victim) return message.reply("birini etiketlemelisin.")
    let user = await User.findOrCreate(message.author.id);

    if(user.Coin < value) return message.reply("yeterli paran yok :(");

    user.Coin -= value;
    await user.save();

    await User.updateOne({Id: victim.id}, {$inc: {"Coin": value}}).exec();
    message.reply(`${victim} kişisine **${value}** değerinde puan gönderdin.`)
}

module.exports.settings = {
    Commands: ["cointransfer", "transfercoin"],
    Usage: "transfer @user <amount>",
    Description: "Etiketlemiş olduğun kişiye belirtmiş olduğun kadar puan transfer edersin.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}