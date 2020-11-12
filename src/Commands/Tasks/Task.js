const {Message, Client, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Task = require("../../Utils/Schemas/Task");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let görev = await Task.findOne({Id: message.author.id}).exec();
    if(!görev){
        await message.reply("upps! sanırsam sana görev oluşturmayı unutmuşum. her neyse, biraz bekle, sana birkaç tane görev oluşturup geliyorum :D");
        let tasks = CreateTask(0);
        
        let task = {
            Voice: {
                LastActivity: undefined,
                Target: tasks.voice,
                Current: 0
            },
            Message: {
                LastActivity: undefined,
                Target: tasks.message,
                Current: 0
            }
        };
        new Task({
            Id: message.author.id,
            StartTime: Date.now(),
            Task: task,
            ComplatedTask: [],
            Difficulty: 0
        }).save();
        return message.channel.csend(`Mesaj: ${task.Message.Target} | Ses: ${task.Voice.Target}`);
    }

    if(görev.Task.Message.Target <= görev.Task.Message.Current && görev.Task.Voice.Target <= görev.Task.Voice.Current){
        message.reply("eski görevlerini tamamlamışsın bunun için sana yeni bir görev veriyorum.");
        görev.ComplatedTask.push({Element: görev.Task, Date: Date.now()});
        görev.Difficulty += 1;
        let newTask = CreateTask(görev.Difficulty);
        görev.Task = {
            Voice: {
                LastActivity: undefined,
                Target: newTask.voice,
                Current: 0
            },
            Message: {
                LastActivity: undefined,
                Target: newTask.message,
                Current: 0
            }
        };
        görev.StartTime = Date.now();
        await görev.save();
    }

    return message.channel.csend(new MessageEmbed()
    .setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
    .setFooter(`Bugüne kadar toplam ${görev.ComplatedTask.length} görev tamamlamışsın.`)
    .setTimestamp()
    .addField("<a:18:770228020883357697> Hedef Görevler <a:18:770228020883357697>", `\n
    ${görev.Task.Message.Current < görev.Task.Message.Target ? "<:728367:772712994668150814>" : "<:728367:772712959624871947>"} ${görev.Task.Message.Current < görev.Task.Message.Target ? "" : "~~"} **Mesaj:** ${görev.Task.Message.Current > görev.Task.Message.Target ? görev.Task.Message.Target : görev.Task.Message.Current}/${görev.Task.Message.Target} mesaj ${görev.Task.Message.Current < görev.Task.Message.Target ? "" : "~~"}
    ${görev.Task.Voice.Current < görev.Task.Voice.Target ? "<:728367:772712994668150814>" : "<:728367:772712959624871947>"} ${görev.Task.Voice.Current < görev.Task.Voice.Target ? "" : "~~"} **Ses:** ${görev.Task.Voice.Current > görev.Task.Voice.Target ? (görev.Task.Voice.Target/60000) : (görev.Task.Voice.Current / 60000).toFixed(0)}/${görev.Task.Voice.Target / 60000} dakika ${görev.Task.Voice.Current < görev.Task.Voice.Target ? "" : "~~"}
    `, true)
    .addField("<a:17:770228009227517992> Bilgilendirme <a:17:770228009227517992>", `
    __Tamamlanan Görev:__ ${görev.ComplatedTask.length} 

    **Mevcut Seviye:** ${görev.Difficulty}
    `, true));
}

module.exports.settings = {
    Commands: ["task", "görev"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}

function CreateTask(difficulty){
    let message = MessageDifficultySizer(difficulty);
    let voice = VoiceDifficultySizer(difficulty);

    return {message, voice};
}

function MessageDifficultySizer(value){
    return 5 * (Math.pow(value, 2)) + 50 * value + 100;
}

function VoiceDifficultySizer(value){
    return ((Math.pow(value, 2)) + 50 * value + 30) * (1000 * 60);
}