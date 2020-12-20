const { Message, Client, MessageEmbed, Role } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Utils/Schemas/Task");

const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

const ms = require("ms");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        let seçim = args[0];
        if (seçim == "create") {
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
                Members: target.members.map(member => ({ Id: member.id, Voice: 0, Message: 0 }))
            });
            await task.save();

            let embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription(`${target} rolü için ${message.author} tarafından **${messageCount}** hedef mesaj ve **${voice}** sesli süresi görevi oluşturdu. Görev toplam **${task.Members.length}** kişi tarafından gerçekleştirilmek üzere eklendi.\n\n ❔ **Görev Hakkında Bilgiler** ❗\n \`Hedef:\` ${target}\n \`Mesaj:\` ${messageCount} mesaj\n \`Ses:\` ${voice} dakika sesli\n \`Görev Katılımı:\` ${task.Members.length}\n Görev Numarası: \`${task._id}\``);

            return message.channel.send(embed);
        }
        else if (seçim == "modify") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            let task = await Task.findOne({ _id: id }, { "Members": 0 });
            if (!task) return message.reply(`belirtmiş olduğun \`${id}\` üzerine kayıtlı bir görev bulamadım.`);
            let field = (args[2] || "").toLowerCase();
            switch (field) {
                case "message":
                    let targetMessage = (args[3] || NaN);
                    if (isNaN(targetMessage)) return message.reply("lütfen geçerli bir mesaj adeti giriniz. Girmiş olduğunuz mesaj adeti geçersiz.");
                    let oldMessage = task.Message;
                    task.Message = targetMessage;
                    await task.save();
                    message.reply(`\`${task._id}\` numaralı görevi tamamlamak için olan hedef mesaj \`${oldMessage}\` > \`${targetMessage}\` olarak değiştirildi.`);
                    break;
                case "voice":
                    let targetVoice = (args[3] || NaN);
                    if (isNaN(targetVoice)) return message.reply("lütfen geçerli bir ses süresi giriniz. Girmiş olduğunuz ses süresi geçersiz.");
                    let oldVoice = task.Voice;
                    task.Voice = targetVoice * (1000 * 60);
                    await task.save();
                    message.reply(`\`${task._id}\` numaralı görevi tamamlamak için olan hedef ses \`${oldVoice / (1000 * 60)}\` > \`${targetVoice}\` dakika olarak değiştirildi.`);
                    break;
                case "reason":
                    let reason = (args.splice(4).join(" "));
                    if (!reason) return message.reply("Eğer bir açıklama kaydetmek istiyorsan ilk önce açıklamayı yazmalısın.");
                    task.Reason = reason;
                    await task.save();
                    message.reply(`\`${task._id}\` numaralı görevinin açıklaması \`${reason}\` olarak değiştirildi.`);
                    break;
                case "finish":
                    let time = args[3];
                    if (!time || !ms(time)) return message.reply("görevin bitiş süresini düzenlemek istiyorsan lütfen düzgün bir formatta zaman gir. `10h/10d/10s`");
                    time = ms(time);
                    let zaman = task.FinishTime;
                    task.FinishTime = Date.now() + time;
                    await task.save();
                    message.reply(`\`${task._id}\` numaralı görevin bitiş zamanı \`${moment(zaman).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}\` > \`${moment(task.FinishTime).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}\` olarak değiştirildi.`);
                    break;
                case "activity":
                    let activity = (args[3] || undefined);
                    if (!activity) return message.reply("eğer bir görevin aktifliğini kapatmak ya da açmak istiyorsan `evet/hayır` demelisin.");
                    activity = activity.toLowerCase() == "evet" ? true : false;
                    let eski = task.Activity;
                    task.Activity = activity;
                    await task.save();
                    message.reply(`\`${task._id}\` numaralı görevin geçerliliği \`${eski == true ? "evet" : "hayır"}\` > \`${activity == true ? "evet" : "hayır"}\` olarak değiştirildi.`);
                    break;
                default:
                    return message.reply("lütfen değiştirmek istediğin bir alan seç. `message/voice/finish/activity/reason`");
                    break;
            }
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