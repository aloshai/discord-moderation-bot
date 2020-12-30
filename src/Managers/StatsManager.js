const Stat = require("../Models/Database/Stat");
const Task = require("../Models/Database/Task");
const tm = require("./TimeManager");
const Settings = require("../Configuration/Settings.json");

class StatsManager {
    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    static async addVoiceStat(id, channel, value) {
        Task.updateMany({"Members.Id": id, "Activity": true, "FinishTime": {$gte: Date.now()}}, {$inc: {"Members.$.Voice": value}}).exec((err, res) => {
            if(err) console.error(err);
        });
        return Stat.updateOne({ Id: id }, { $inc: { AllVoice: value, [`Voice.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value } }, { upsert: true }).exec();
    }

    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    static async addMessageStat(id, channel, value) {
        Task.updateMany({"Members.Id": id, "Activity": true, "FinishTime": {$gte: Date.now()}}, {$inc: {"Members.$.Message": value}}).exec((err, res) => {
            if(err) console.error(err);
        });
        return Stat.updateOne({ Id: id }, { $inc: { AllMessage: value, [`Message.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value } }, { upsert: true }).exec();
    }

    /**
     * @param {String} id 
     */
    static async resetVoiceStat(id = undefined) {
        if (id) return Stat.findOneAndUpdate({ Id: id }, { $set: { "Voice": {} } }).exec((err) => { if (err) console.error(err) });
        return Stat.updateMany({ Voice: { $exists: true } }, { $set: { "Voice": {} } }, { multi: true }).exec();
    }

    /**
     * @param {String} id 
     */
    static async resetMessageStat(id = undefined) {
        if (id) return Stat.findOneAndUpdate({ Id: id }, { $set: { "Message": {} } }).exec((err) => { if (err) console.error(err) });
        return Stat.updateMany({ Message: { $exists: true } }, { $set: { "Message": {} } }, { multi: true }).exec();
    }
}

module.exports = StatsManager;