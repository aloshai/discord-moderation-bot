const { Message, Client, MessageEmbed } = require("discord.js");

const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (message.author.id != message.guild.ownerID) return message.reply("yetkin yetmiyor");

    let code = args.join(" ");
    let result;
    try {
        result = eval(code);
    } catch (error) {
        result = error;
    }

    message.channel.send(result, {
        code: true,
        split: true
    });
}

module.exports.settings = {
    Commands: ["eval"],
    Usage: "eval <code>",
    Description: "Bu komut yoook :D",
    cooldown: 2500,
    Activity: true
}