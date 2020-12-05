const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const User = require("../../Utils/Schemas/User");

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

    if(value > Settings.Market.MaxCoinBet) return message.reply(`maksimum :coin:${Settings.Market.MaxCoinBet} değerinde bir bahis girebilirsin.`);

    let user = await User.findOrCreate(message.author.id);
    if(user.Coin < value){
        if(user.Coin >= Settings.Market.MaxCoinBet) value = Settings.Market.MaxCoinBet;
        else value = user.Coin;
    }
    await User.updateOne({Id: message.author.id}, {$inc: {Coin: -value}});

    message.channel.send(`${message.author}, para fırlatılıyor...`).then(msg => {
        let rnd = Math.floor(Math.random() * 2), result;
        if(rnd == 1){
            result = "kazandın";
            let coin = value + value;
            User.updateOne({Id: message.author.id}, {$inc: {Coin: coin}});
        }
        else result = "kaybettin";
        msg.edit(`${message.author}, **${value}** ${result}!`);

    });
}

module.exports.settings = {
    Commands: ["yazitura", "yazıtura", "yazi-tura", "yazı-tura", "coinflip"],
    Usage: "!coinflip <bahis>",
    Description: "",
    cooldown: 5000,
    Activity: true
}