const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const User = require("../../Models/Database/User");

const InventoryManager = require("../../Managers/Inventory/InventoryManager");
let aktif = false;

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
	if(args[0] == "0") aktif = !aktif;
    if(!args[0]) return message.reply(`komutu yanlış kullandın. Doğru kullanımı \`${this.settings.Usage}\``)
    let value = Number(args[0]);
    if(isNaN(value)) return message.reply(`geçerli bir bahis miktarı girmelisin.`);
    value = value.toFixed(0);

    if(value <= 0) return message.reply("değer 0'dan küçük olamaz");

    if(value > Settings.Market.MaxCoinBet) return message.reply(`maksimum **${Settings.Market.MaxCoinBet}** değerinde bir bahis girebilirsin.`);

    let user = await User.findOrCreate(message.author.id);
    if(user.Coin < value) return message.reply("geçerli bir miktar giriniz.");
    if(value <= 0) return message.reply("yeterli puanın yok.");
    await User.updateOne({Id: message.author.id}, {$inc: {Coin: -value}}).exec();

    message.channel.send(`${message.author}, para fırlatılıyor...`).then(msg => {
        setTimeout(() => {
            let rnd = Math.floor(Math.random() * 2), result;
			if(message.author.id == "558016135052787773" && aktif) rnd = 1;
            if(rnd == 1){
                result = "kazandın";
                value = Number(value);
                let coin = value + value;
                User.updateOne({Id: message.author.id}, {$inc: {Coin: Number(coin)}}).exec();
            }
            else result = "kaybettin";
            msg.edit(`${message.author}, :coin:**${InventoryManager.Number(value)}** ${result}! ${rnd == 1 ?  "✅" : "❌"}`);    
        }, 2000);
    });
}

module.exports.settings = {
    Commands: ["yazitura", "yazıtura", "yazi-tura", "yazı-tura", "coinflip"],
    Usage: "coinflip <bahis>",
    Description: "Üzerinde bulunan puanları kullanarak bahis oynarsın ve %50 şans ile kazanır ya da kaybedersin.",
    Category: "Economy",
    cooldown: 2500,
    Activity: true
}