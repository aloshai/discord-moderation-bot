const { Message, Client, MessageEmbed, Role } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Utils/Schemas/Task");

const ms = require("ms");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        let seçim = args[0];
        switch (seçim) {
            case "create":
                /**
                 * @type {Role} target
                 */
                let target = args[1];
                if (!target) return message.reply("bir hedef belirlemelisin. Bir rolü ya da birisini etiketleyebilirsin.");

                target = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!target) return message.reply("geçerli bir hedef belirtmedin.");

                let messageCount = Number(args[2]);
                if (isNaN(messageCount)) return message.reply("hedef bir mesaj sayısı belirle.");
                let voice = Number(args[3]);
                if (isNaN(voice)) return message.reply("hedef bir ses süresi belirle.");
                let time = args[4];
                if (!time || !ms(time)) return message.reply("lütfen geçerli bir süre gir.");
                time = ms(time);
                let reason = args.splice(5).join(" ") || undefined;

                let task = new Task({
                    Activity: true,
                    Target: target.id,
                    StartTime: Date.now(),
                    FinishTime: Date.now() + time,
                    Message: messageCount,
                    Voice: (voice * (1000 * 60)),
                    Reason: reason,
                    Members: target.members.map(member => ({Id: member.id, Voice: 0, Message: 0}))
                });
                await task.save();
                
                let embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
                .setTimestamp()
                .setDescription(`${target} rolü için ${message.author} tarafından **${messageCount}** hedef mesaj ve **${voice}** sesli süresi görevi oluşturdu. Görev toplam **${task.Members.length}** kişi tarafından gerçekleştirilmek üzere eklendi.\n\n ❔ **Görev Hakkında Bilgiler** ❗\n \`Hedef:\` ${target}\n \`Mesaj:\` ${messageCount} mesaj\n \`Ses:\` ${voice} dakika sesli\n \`Görev Katılımı:\` ${task.Members.length}\n Görev Numarası: \`${task._id}\``);

                message.channel.send(embed);
                break;
        }
    }
}

module.exports.settings = {
    Commands: ["task", "görev"],
    Usage: "task",
    Description: "Bir görev oluşturmak için kullanabilirsin.",
    Category: "Task",
    cooldown: 5000,
    Activity: true
}