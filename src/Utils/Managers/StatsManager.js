const Stat = require("../Schemas/Stat");
const HelperStat = require("../Schemas/HelperStat");
const tm = require("./TimeManager");
const Settings = require("../../Configuration/Settings.json");

class StatsManager {
    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    static async addVoiceStat(id, channel, value) {
        HelperStat.updateOne({Id: id}, {$inc: {Voice: value}}, {upsert: true}).exec();
        return Stat.updateOne({Id: id}, {$inc: {[`Voice.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value}}, {upsert: true}).exec();
    }

    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    static async addMessageStat(id, channel, value) {
        console.log(tm.getDay);
        HelperStat.updateOne({Id: id}, {$inc: {Message: value}}, {upsert: true}).exec();
        return Stat.updateOne({Id: id}, {$inc: {[`Message.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value}}, {upsert: true}).exec();
    }

    /**
     * @param {String} id 
     */
    static async resetVoiceStat(id = undefined){
        if(id) return Stat.findOneAndUpdate({Id: id}, {$set: {"Voice": {}}}).exec((err) => {if(err) console.error(err)});
        return Stat.updateMany({Voice: {$exists: true}}, {$set: {"Voice": {}}}, {multi: true}).exec();
    }

    /**
     * @param {String} id 
     */
    static async resetMessageStat(id = undefined){
        if(id) return Stat.findOneAndUpdate({Id: id}, {$set: {"Message": {}}}).exec((err) => {if(err) console.error(err)});
        return Stat.updateMany({Message: {$exists: true}}, {$set: {"Message": {}}}, {multi: true}).exec();
    }
}

module.exports = StatsManager;