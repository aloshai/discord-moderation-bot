const Stat = require("../Schemas/Stat");
const TimeManager = require("./TimeManager");
const tm = new TimeManager();
const Settings = require("../../Configuration/Settings.json");

class StatsManager {
    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    async addVoiceStat(id, channel = "notfound", value) {
        return Stat.updateOne({Id: id}, {$inc: {[`Voice.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value}}, {upsert: true}).exec();
    }

    /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     */
    async addMessageStat(id, channel = "notfound", value) {
        return Stat.updateOne({Id: id}, {$inc: {[`Message.${await tm.getDay(Settings.Server.Id)}.${channel}`]: value}}, {upsert: true}).exec();
    }

    /**
     * @param {String} id 
     */
    async resetVoiceStat(id = undefined){
        if(id) return Stat.findOneAndUpdate({Id: id}, {$set: {"Voice": {}}}).exec((err) => {if(err) console.error(err)});
        return Stat.updateMany({Voice: {$exists: true}}, {$set: {"Voice": {}}}, {multi: true}).exec();
    }

    /**
     * @param {String} id 
     */
    async resetMessageStat(id = undefined){
        if(id) return Stat.findOneAndUpdate({Id: id}, {$set: {"Message": {}}}).exec((err) => {if(err) console.error(err)});
        return Stat.updateMany({Message: {$exists: true}}, {$set: {"Message": {}}}, {multi: true}).exec();
    }
}

module.exports = StatsManager;