const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Models/Database/User");

const DropCoins = global.DropCoins = new Array();

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!args[0]) return message.reply(`komutu yanlış kullandın. Doğru kullanımı \`${this.settings.Usage}\``)
    let value = Number(args[0]);
    if(isNaN(value)) return message.reply(`geçerli bir bahis miktarı girmelisin.`);
    value = value.toFixed(0);

    if(value <= 0) return message.reply("değer 0'dan küçük olamaz");
    let user = await User.findOrCreate(message.author.id);

    if(user.Coin < value) return message.reply("bu kadar bakiyen yok.");
    await User.updateOne({Id: user.Id}, {$inc: {Coin: -value}}).exec();

    DropCoins.push({Id: message.author.id, Coin: value});
    message.reply(`yere **${value}** puan bıraktın. (Almak için \`!take | !cointake | !takecoin\`)`);
}

module.exports.settings = {
    Commands: ["coindrop", "dropcoin"],
    Usage: "drop <miktar>",
    Description: "O kanalda yere belirtmiş olduğun kadar para bırakırsın ve başkası o parayı **take** komutu ile alabilir.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}