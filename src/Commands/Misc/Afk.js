const { Message, Client } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

const Afk = global.Afk = new Map();

/**
 * 
 * @param {Client} client 
 */
module.exports.onLoad = (client) => {
    client.on("message", (message) => {
        if (message.author.bot || message.channel.type == "dm") return;
        let author = message.author;

        if (Afk.has(author.id)) {
            Afk.delete(author.id);
            return message.reply("artık AFK değilsin!");
        }

        let user = message.mentions.users.first();
        if (user && Afk.has(user.id)) {
            let data = Afk.get(user.id);
            return message.reply(`etiketlediğin kişi ${data.reason ? "**" + data.reason + "** sebebiyle şu an uzakta." : "şu an AFK."}`)
        }
    });
}

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let reason = args.length <= 0 ? undefined : args.join(" ");
    Afk.set(message.author.id, {
        reason: reason
    });
    message.reply("artık afk modundasın :c");
}

module.exports.settings = {
    Commands: ["afk"],
    Usage: "afk <reason>",
    Description: "AFK kalmak için bir neden belirtirsin ve seni etiketleyen herkes bu mesajı görür.",
    Category: "Useable",
    Activity: true
}