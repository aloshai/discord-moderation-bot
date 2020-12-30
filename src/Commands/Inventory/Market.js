const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

const User = require("../../Models/Database/User");
const Stat = require("../../Models/Database/Stat");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {


    if (args[0] == "buy") {
        let itemId = args[1];
        if(!itemId) return message.reply("bir eşya ID'si girmelisin.");

        let item = InventoryManager.FindItem(itemId.toUpperCase());
        if(!item) return message.reply("böyle bir eşya yok. Geçerli bir ID girmeyi dene.");
        if(!item.Price) return message.reply("bu eşya satın alınamıyor.");

        let user = await User.findOrCreate(message.author.id);

        if(item.PriceType && item.PriceType == "STAT_VOICE"){
            let stat = await Stat.findOne({Id: user.Id}, {Message: 0, Voice: 0});
            if(!stat) return message.reply("hiç ses aktiviten yok :(");
            if(stat.AllVoice < (item.Price * (1000 * 60))) return message.reply("bu işlemi yapabilmek için yeterli ses aktiviten yok.");
            await Stat.updateOne({Id: user.Id}, {$inc: {AllVoice: -(item.Price * (1000 * 60))}}).exec();
        }
        else if(item.PriceType && item.PriceType == "STAT_CHAT"){
            let stat = await Stat.findOne({Id: user.Id}, {Message: 0, Voice: 0});
            if(!stat) return message.reply("hiç mesaj aktiviten yok :(");
            if(stat.AllMessage < (item.Price)) return message.reply("bu işlemi yapabilmek için yeterli mesaj aktiviten yok.");
            await Stat.updateOne({Id: user.Id}, {$inc: {AllMessage: -item.Price}}).exec();
        }
        else if(user.Coin < item.Price) return message.reply("yeterli puanın yok.");

        if(!item.PriceType) await User.updateOne({Id: user.Id}, {$inc: {"Coin": -item.Price}}).exec();
        InventoryManager.addItemOfInventory(user, item, 1);

        message.reply(`${item.Name} isimli eşyayı satın aldın. ✅`);
        return;
    }
    else if(args[0] == "sell"){
        let itemId = args[1];
        if(!itemId) return message.reply("bir eşya ID'si girmelisin.");
        
        let item = InventoryManager.FindItem(itemId.toUpperCase());
        if(!item) return message.reply("böyle bir eşya yok. Geçerli bir ID girmeyi dene.");
        if(!item.Sell) return message.reply("bu eşya satılamıyor.");

        let user = await User.findOrCreate(message.author.id);
        let inventoryItem = InventoryManager.FindItemToArray(user.Inventory, item.Id);
        if(!inventoryItem || (inventoryItem && inventoryItem.Count <= 0)) return message.reply("envanterinde bu eşya yok.");

        let count = args[2];
        if(!count) return message.reply("kaç adet satmak istediğini belirt.");
        if(count == "all") count = inventoryItem.Count;
        else{
            count = Number(count);
            if(isNaN(count)) return message.reply("geçerli bir sayı girmelisin.");    
        }

        let money = count * item.Sell;
        await InventoryManager.removeItemOfInventory(user, item, count);
        User.updateOne({Id: user.Id}, {$inc: {"Coin": money}}).exec((err, res) => {
            if(err) return console.error(err);
            message.reply(`başarılı bir şekilde ${item.Name} eşyasından **${count}** adet sattın ve sana toplam **${money}** puan verildi.`);
        });
        return;
    }

    let items = InventoryManager.Items;
    let list = items.map((item, index) => `\`${index + 1}.\` ${item.Name} (${item.Id}) | ${item.Sell ? `Sat: **${item.Sell} puan**` : ""} ${item.Price ? `Al: **${item.Price} puan**` : ""}`).join("\n");

    message.channel.send(new MessageEmbed().setDescription(list).setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })));
}

module.exports.settings = {
    Commands: ["market", "shop"],
    Usage: "market [buy|sell]",
    Description: "Marketin içerisinde ne olduğunu ya da markette bulunan bir eşyayı satın alabilir veya satabilirsin.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}