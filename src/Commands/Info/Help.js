const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Categorys = {};

global.Client.on("ready", () => {
    let commands = global.Commands;

    commands.forEach(command => {
        let data = Categorys[(command.settings.Category && command.settings.Category.toLowerCase()) || "misc"];
        if(data) data.push(command.settings);
        else Categorys[(command.settings.Category && command.settings.Category.toLowerCase()) || "misc"] = [command.settings];
    });
});

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setFooter("© 2020").setTimestamp().setColor("33AFFF").setAuthor(message.author.username, message.author.avatarURL({dynamic: true}));
    if(args.length >= 1){
        let name = args[0].toLowerCase();

        let category = Categorys[name];
        if(category){
            embed.setDescription(`
            Bu kategori **${name.toUpperCase()}** ait bu kategoriye ait tüm komutları buradan görebilirsin. ;)
    
            ❕ **Komutlar ve kullanımları** ❔
            ${category.map(command => `**-** \`${Config.Prefix}${command.Commands[0]}\` komutu ${command.Usage ? `\`${Config.Prefix}${command.Usage}\` |` : ""} \`${Config.Prefix}help ${command.Commands[0]}\``).join("\n")}

            `)
            message.channel.csend(embed);    
        }
        else{

            let command = global.Commands.find(command => command.settings.Commands.some(c => c.toLowerCase() == name));
            if(!command) return message.reply("belirtmiş olduğun ad ile bir komut bulamadım :(");

            embed.setDescription(`            
            **Komut:** \`${command.settings.Commands[0]}\`
            **Açıklama:** \`${Config.Prefix}${command.settings.Description}\`
            **Kullanımı:** \`${command.settings.Usage}\`
            **Kategori:** \`${command.settings.Category || "Misc"}\`
            **Tekrar Kullanım:** \`${(command.settings.cooldown || 1000) / 1000} saniye\`
            `)
            message.channel.csend(embed);
        }

    }
    else{
        embed.setDescription(`
        Merhaba, burası yardım menüsü ve burayı kullanarak bazı komutların tam olarak nasıl kullanıldığını, ne işe yaradığını ya da daha kısa nasıl yazabileceğini öğrenebilirsin!

        ❗ **Kategoriler ve kullanımları** ❓
        ${Object.keys(Categorys).map(category => `**-** \`${Config.Prefix}help ${category}\`: ${category} kategorisindeki komutları gösterir.`).join("\n")}
        `)
        message.channel.csend(embed);
    }
}

module.exports.settings = {
    Commands: ["yardim", "help", "yardım"],
    Usage: "help <category|command>",
    Description: "Botta bulunan komutlar, sistemler ve kategori altındaki gizli şeyleri daha detaylı bir şekilde görebilirsin.",
    Category: "Info",
    cooldown: 3000,
    Activity: true
}
