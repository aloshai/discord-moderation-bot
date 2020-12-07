const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Utils/Schemas/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let DropCoins = global.DropCoins;
    if(DropCoins.length <= 0) return message.reply("hiç drop yok.");

    let coin = DropCoins[0];
    DropCoins.splice(0, 1);

    let user = await User.findOrCreate(message.author.id);

    await User.updateOne({Id: user.Id}, {$inc: {Coin: coin.Coin}}).exec();

    message.reply(`<@${coin.Id}>'nin **${coin.Coin}**'lik dropunu aldın.`);
}

module.exports.settings = {
    Commands: ["take", "takecoin", "cointake"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}