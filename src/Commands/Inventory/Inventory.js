const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

const User = require("../../Models/Database/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    if(args[0] == "use"){
        let itemId = args[1];
        if(!itemId) return message.reply("bir tane eşya ID'si girmelisin.");

        let item = InventoryManager.FindItem(itemId.toUpperCase());
        if(!item) return message.reply("böyle bir eşya yok. Geçerli bir eşya ID'si girin.");
        if(item.Type != "USEABLE") return message.reply("bu eşya kullanılabilir bir eşya değil.");

        if(!user.Inventory.some(userItem => userItem.Id == item.Id)) return message.reply("bu eşya senin envanterinde yok.");

        let response = await item.use(user.Id) || "";
        await InventoryManager.removeItemOfInventory(user, item, 1);
        message.reply(`${item.Name} adlı eşyayı kullandın! ${response}`);
        return;
    }

    let list = user.Inventory.map(userItem => {
        let item = InventoryManager.FindItem(userItem.Id);
        return `${item.Name}${InventoryManager.Number(userItem.Count)}`
    }).join(", ");

    message.channel.send(new MessageEmbed().setDescription(list).setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })));
}

module.exports.settings = {
    Commands: ["inventory", "envanter"],
    Usage: "inventory [use|open|remove]",
    Description: "Envanteri yönetmeni ya da envanterinde neler olduğunu görmeni sağlar.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}