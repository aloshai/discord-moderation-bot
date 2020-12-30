const Settings = require("../../Configuration/Settings.json");

const {MessageEmbed} = require("discord.js");

const client = global.Client;

const InventoryManager = require("../../Managers/Inventory/InventoryManager");
const User = require("../../Models/Database/User");
let lastDrop = undefined;

module.exports = () => {
    setInterval(() => {
        if(lastDrop && (Date.now() - lastDrop) / (1000 * 60) < 5) return;
        lastDrop = Date.now();

        let channel = client.channels.cache.get(Settings.Market.DropChannel);
        if(!channel) return;

        channel.send(new MessageEmbed()
        .setFooter("Bir kasa düştü!")
        .setImage("https://cdn.discordapp.com/attachments/777670253017563168/785105997982072873/coincrate-1.png")).then(async msg => {
            await msg.react("🤍");

            let reaction = await msg.awaitReactions((react, user) => react.emoji.name == "🤍" && react.message.id == msg.id, {
                max: 1,
                time: 10000
            });
            
            let react = reaction.first();
            if(react){
                let user = react.users.cache.filter(e => !e.bot).first();
                if(!user) return;
                let newUser = await User.findOrCreate(user.id);
                let crate = InventoryManager.FindItem("COIN_CRATE");
                await InventoryManager.addItemOfInventory(newUser, crate, 1);
            }
            else msg.delete();
            return;
        });
    }, 5000);
}

module.exports.config = {
    Event: "ready"
}