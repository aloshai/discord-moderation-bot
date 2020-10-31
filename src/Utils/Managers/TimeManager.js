const Guild = require("../Schemas/Guild");
const Settings = require("../../Configuration/Settings.json");

class TimeManager {
    async getDay(id) {
        let x = await Guild.findOne({Id: id}).exec().then((doc) => {
            if(!doc) {
                new Guild({Id: id,Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0)}).save();
                return 1;   
            }
            else {
                return doc.Day;}
        });
        return x;
    }

    async addDay(id, value){
        let data = await Guild.findOneAndUpdate({Id: id}, {$inc: {Day: value}}, {upsert: true, setDefaultsOnInsert: true}).exec((err, doc) => {
            if(err) console.error(err);
        });
    }
    async sumDay(id, value){
        let data = await Guild.findOneAndUpdate({Id: id}, {$inc: {Day: -value}}, {upsert: true, setDefaultsOnInsert: true}).exec((err, doc) => {
            if(err) console.error(err);
        });
    }

    async checkDay(id){ 
        let data = await Guild.findOne({Id: id}).exec();
        if(!data) return new Guild({Id: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0)}).save();
        if(data.NextUpdate < Date.now()) {
            data.NextUpdate = new Date().setHours(24, 0, 0, 0);
            data.Day += 1;
        }
        data.save();
    }
}

module.exports = TimeManager;