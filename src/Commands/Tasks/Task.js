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
                Target: tasks.voice
            },
            Message: {
                LastActivity: undefined,
                Target: tasks.message
            }
        }

        new Task({
            Id: message.author.id,
            StartTime: Date.now(),
            Task: task,
            ComplatedTask: {}
        }).save();

        return message.channel.csend();
    }
}

module.exports.settings = {
    Commands: ["task", "görev"],
    Usage: "",
    Description: "",
    cooldown: 10000,
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
    return (Math.pow(value, 2)) + 50 * value + 30;
}