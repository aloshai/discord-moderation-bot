const { Message, Client, MessageEmbed, Role, MessageAttachment } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Models/Database/Task");

const moment = require("moment");
moment.locale("tr");
require("moment-duration-format");
require("moment-timezone");

const table = require("table");
const randomstring = require("randomstring");

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
                Id: randomstring.generate(5),
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
                .setDescription(`${target} rolü için ${message.author} tarafından **${messageCount}** hedef mesaj ve **${voice}** sesli süresi görevi oluşturdu. Görev toplam **${task.Members.length}** kişi tarafından gerçekleştirilmek üzere eklendi.\n\n ❔ **Görev Hakkında Bilgiler** ❗\n \`Hedef:\` ${target}\n \`Mesaj:\` ${messageCount} mesaj\n \`Ses:\` ${voice} dakika sesli\n \`Görev Katılımı:\` ${task.Members.length}\n Görev Numarası: \`${task.Id}\``);

            return message.channel.send(embed);
        }
        else if (seçim == "modify") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            let task = await Task.findOne({ Id: id }, { "Members": 0 });
            if (!task) return message.reply(`belirtmiş olduğun \`${id}\` üzerine kayıtlı bir görev bulamadım.`);
            let field = (args[2] || "").toLowerCase();
            switch (field) {
                case "message":
                    let targetMessage = (args[3] || NaN);
                    if (isNaN(targetMessage)) return message.reply("lütfen geçerli bir mesaj adeti giriniz. Girmiş olduğunuz mesaj adeti geçersiz.");
                    let oldMessage = task.Message;
                    task.Message = targetMessage;
                    message.reply(`\`${task.Id}\` numaralı görevi tamamlamak için olan hedef mesaj \`${oldMessage}\` > \`${targetMessage}\` olarak değiştirildi.`);
                    break;
                case "voice":
                    let targetVoice = (args[3] || NaN);
                    if (isNaN(targetVoice)) return message.reply("lütfen geçerli bir ses süresi giriniz. Girmiş olduğunuz ses süresi geçersiz.");
                    let oldVoice = task.Voice;
                    task.Voice = targetVoice * (1000 * 60);
                    message.reply(`\`${task.Id}\` numaralı görevi tamamlamak için olan hedef ses \`${oldVoice / (1000 * 60)}\` > \`${targetVoice}\` dakika olarak değiştirildi.`);
                    break;
                case "reason":
                    let reason = (args.splice(4).join(" "));
                    if (!reason) return message.reply("Eğer bir açıklama kaydetmek istiyorsan ilk önce açıklamayı yazmalısın.");
                    task.Reason = reason;
                    message.reply(`\`${task.Id}\` numaralı görevinin açıklaması \`${reason}\` olarak değiştirildi.`);
                    break;
                case "finish":
                    let time = args[3];
                    if (!time || !ms(time)) return message.reply("görevin bitiş süresini düzenlemek istiyorsan lütfen düzgün bir formatta zaman gir. `10h/10d/10s`");
                    time = ms(time);
                    let zaman = task.FinishTime;
                    task.FinishTime = Date.now() + time;
                    message.reply(`\`${task.Id}\` numaralı görevin bitiş zamanı \`${moment(zaman).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}\` > \`${moment(task.FinishTime).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}\` olarak değiştirildi.`);
                    break;
                case "activity":
                    let activity = (args[3] || undefined);
                    if (!activity) return message.reply("eğer bir görevin aktifliğini kapatmak ya da açmak istiyorsan `evet/hayır` demelisin.");
                    activity = activity.toLowerCase() == "evet" ? true : false;
                    let eski = task.Activity;
                    task.Activity = activity;
                    message.reply(`\`${task.Id}\` numaralı görevin geçerliliği \`${eski == true ? "evet" : "hayır"}\` > \`${activity == true ? "evet" : "hayır"}\` olarak değiştirildi.`);
                    break;
                default:
                    return message.reply("lütfen değiştirmek istediğin bir alan seç. `message/voice/finish/activity/reason`");
            }
            await task.save();
            return;
        }
        else if (seçim == "add") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            let task = await Task.findOne({ Id: id }, { "Members": 0 });
            if (!task) return message.reply(`belirtmiş olduğun \`${id}\` üzerine kayıtlı bir görev bulamadım.`);
            let victim = message.mentions.members.first() || (await message.guild.getMember(args[2]));
            if (!victim) return message.reply(`göreve yeni birisini eklemek istiyorsan ilk önce birisini etiketlemelisin.`);

            Task.updateOne({ Id: task.Id, "Members.Id": { $ne: victim.id } }, { $push: { "Members": { Id: victim.id, Voice: 0, Message: 0 } } }).exec((err, result) => {
                if (err) console.error(err);
                else {
                    let status = result.n >= 1 ? "eklendi" : "zaten olduğu için eklenemedi";
                    message.reply(`\`${task.Id}\` numaralı göreve ${victim} adlı kullanıcı **${status}**.`);
                }
            });
            return;
        }
        else if (seçim == "remove") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            let task = await Task.findOne({ Id: id }, { "Members": 0 });
            if (!task) return message.reply(`belirtmiş olduğun \`${id}\` üzerine kayıtlı bir görev bulamadım.`);
            let victim = message.mentions.members.first() || (await message.guild.getMember(args[2]));
            if (!victim) return message.reply(`göreve yeni birisini eklemek istiyorsan ilk önce birisini etiketlemelisin.`);

            Task.updateOne({ Id: task.Id, "Members.Id": { $in: [victim.id] } }, { $pull: { "Members": { Id: victim.id } } }).exec((err, result) => {
                if (err) console.error(err);
                else {
                    let status = result.n >= 1 ? "çıkarıldı" : "listede hiç olmadığı için çıkarılamadı.";
                    message.reply(`\`${task.Id}\` numaralı görev için ${victim} kullanıcı görevden **${status}**.`);
                }
            });
            return;
        }
        else if (seçim == "delete") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            Task.deleteOne({ Id: id }).exec((err, result) => {
                if (err) console.error(err);
                else {
                    let status = result.n >= 1 ? "silindi" : "bulunamadığı için silinemedi";
                    message.reply(`\`${id}\` numaralı görev kalıcı olarak **${status}**.`);
                }
            });
            return;
        }
        else if (seçim == "update") {
            let id = args[1];
            if (!id) return message.reply("lütfen geçerli bir id gir.");
            let task = await Task.findOne({ Id: id });
            if (!task) return message.reply(`belirtmiş olduğun \`${id}\` üzerine kayıtlı bir görev bulamadım.`);

            let role = message.guild.roles.cache.get(task.Target);
            if (!role) message.reply("rol silindiği için yeni kullanıcıları bulamıyorum.");

            let outMembers = role.members.filter(member => !task.Members.some(member2 => member2.Id == member.id)).map(member => ({ Id: member.id, Voice: 0, Message: 0 }));
            if (outMembers.length <= 0) return message.reply(`görev dışı kalan hiçbir kullanıcı yok. Bu sebepten dolayı eklemeye yapmaya gerek yok.`);
            Task.updateOne({ Id: task.Id }, { $push: { "Members": { $each: outMembers } } }).exec((err, result) => {
                if (err) console.error(err);
                else {
                    message.reply(`\`${task.Id}\` numaralı görev için **${outMembers.length}** kişi daha sorumluluk edindi.`);
                }
            });
            return;
        }
        else if(seçim == "all"){
            //#region 
            let tasks = await Task.find({Activity: true});
            //#endregion
            let embed = new MessageEmbed().setFooter("© 2020").setTimestamp().setColor("33AFFF").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }));

            let data = [["Id", "Role", "Ses", "Mesaj", "Bitiş"/*, "Tarih"*/]];
            data = data.concat(tasks.map(task => {
                let role = (message.guild.roles.cache.get(task.Target) || {name: "#deleted-role"}).name;
                return [task.Id, role.length > 13 ? role.substring(0, 10).toUpperCase() +"..." : role.toUpperCase(),(task.Voice / (1000 * 60)) + " dakika", task.Message+" mesaj", moment(task.FinishTime).fromNow()]
            }));
            let output = table.table(data, {
                columns: {
                    0: {
                        paddingLeft: 0
                    },
                    1: {
                        paddingLeft: 1
                    },
                    2: {
                        paddingLeft: 1
                    },
                    3: {
                        paddingLeft: 1
                    },
                },
                border: table.getBorderCharacters("void"),
                drawHorizontalLine: function (index, size) {
                    return index === 0 || index === 1 || index === size;
                }
            });

            embed.setDescription(`
            \`\`\`${output}\`\`\`
            `);
            
            return message.channel.send({embed: embed});
        }
    }

    //#region 
    let tasks = await Task.find({ "Members.Id": message.author.id, "Activity": true}, { "Members.$": { $slice: 1 } });
    //#endregion
    let embed = new MessageEmbed().setFooter("© 2020").setTimestamp().setColor("33AFFF").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }));

    let data = [["Rol Bilgisi", "Ses Bilgisi", "Mesaj Bilgisi", "Bitiş Tarihi"/*, "Tarih"*/]];
    data = data.concat(tasks.map(task => {
        let member = task.Members[0];
        let role = (message.guild.roles.cache.get(task.Target) || { name: undefined }).name || "#deleted-role";

        return [(role.length > 13 ? role.substring(0, 10).toUpperCase() +"..." : role.toUpperCase()),
        `${member.Voice >= task.Voice ? (task.Voice / (1000 * 60)) : (member.Voice / (1000 * 60)).toFixed(0)}/${task.Voice / (1000 * 60)} dakika`,
        `${member.Message >= task.Message ? task.Message : member.Message}/${task.Message} mesaj`,
        `${moment(task.FinishTime).fromNow()}`/*, `${moment(task.FinishTime).tz("Europe/Istanbul").format("YYYY.MM.DD HH:mm")}`*/];
    }));

    embed.setDescription(`Toplam ${tasks.length} adet sorumlu olduğun görev var. Aldığın görevlerin detaylı bilgisine aşağıdaki tablolardan erişebilirsin.

    **Aktif Görevler:** ${tasks.length} adet
    **Bitirilen Görevler:** ${tasks.filter(task => task.Voice <= task.Members[0].Voice && task.Message <= task.Members[0].Message).length} adet
    
    \`\`\`js\n${table.table(data, {
        columns: {
            0: {
                paddingLeft: 0
            },
            1: {
                paddingLeft: 1
            },
            2: {
                paddingLeft: 1
            },
            3: {
                paddingLeft: 1
            },
        },
        border: table.getBorderCharacters("void"),
        drawHorizontalLine: function (index, size) {
            return index === 0 || index === 1 || index === size;
        }
    })}\`\`\`
    `);
    message.channel.csend(embed);
}

module.exports.settings = {
    Commands: ["görev", "task"],
    Usage: "task [<@rol|id>|create <@rol|id> <targetMessage> <targetVoice> <finishTime> [reason]/modify [message/voice/activity/reason/finish|settings] <data>/update <id>/remove <@member|id>/add <@member|id>/delete <id>]",
    Description: "Bir görev oluşturmak için kullanabilirsin.",
    Category: "Task",
    cooldown: 5000,
    Activity: true
}