const { Message, Client, MessageEmbed } = require("discord.js");
const InventoryManager = require("../../Managers/Inventory/InventoryManager");

const moment = require("moment");
require("moment-duration-format");

const User = require("../../Models/Database/User");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let roleColor = args[0];
    if(!/^#[0-9A-F]{6}$/i.test(roleColor)) return message.reply("lütfen geçerli bir renk kodu girin. **Örneğin:** `#00ffcc`")
    let roleName = args.splice(1).join(" ");
    let user = await User.findOrCreate(message.author.id);
    if(user.Coin < 50000) return message.reply(`${50000 - user.Coin} puana daha ihtiyacın var!`);
    User.updateOne({_id: user._id}, {$inc: {"Coin": -50000}}, {upsert: true}).exec(async (err, res) => {
        if(err) console.error(err);
        else{
            let mainRole = message.guild.roles.cache.get("795022229980315689");
            let role = await message.guild.roles.create({
                data:{
                    color: roleColor,
                    name: roleName,
                    position: mainRole.position - 1
                }
            });
            await message.member.roles.add(role);
            message.reply(`\`${role.name}\` isimli rolü oluşturdum ve sana verdim. :)`);
        }
    });
}

module.exports.settings = {
    Commands: ["rolecreate", "rololuştur"],
    Usage: "rolecreate",
    Description: "Belli bir miktar paran varsa buradan rol oluşturabilirsin.",
    Category: "Economy",
    cooldown: 5000,
    Activity: true
}