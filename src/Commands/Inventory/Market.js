const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Utils/Managers/Inventory/InventoryManager");

const User = require("../../Utils/Schemas/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {


    if (args[0] == "buy") {
        let itemId = args[1];
        if(!itemId) return message.reply("bir eşya ID'si girmelisin.");

        let item = InventoryManager.FindItem(itemId);
        if(!item) return message.reply("böyle bir eşya yok. Geçerli bir ID girmeyi dene.");
        if(!item.Price) return message.reply("bu eşya satın alınamıyor.");

        let user = await User.findOrCreate(message.author.id);
        if(user.Coin < item.Price) return message.reply("yeterli puanın yok.");

        await User.updateOne({Id: user.Id}, {$inc: {"Coin": -item.Price}}).exec();
        InventoryManager.addItemOfInventory(user, item, 1);

        message.reply(`${item.Name} isimli eşyayı satın aldın. ✅`);
        return;
    }

    let items = InventoryManager.Items;
    let list = items.map((item, index) => `\`${index + 1}.\` ${item.Name}(${item.Id}) | ${item.Sell ? `Sat: **${item.Sell} puan**` : ""} ${item.Price ? `Al: **${item.Price} puan**` : ""}`).join("\n");

    message.channel.send(new MessageEmbed().setDescription(list).setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })));
}

module.exports.settings = {
    Commands: ["market", "shop"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}