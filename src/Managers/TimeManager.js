const Guild = require("../Models/Database/Guild");

class TimeManager {
    static async getDay(id) {
        let x = await Guild.findOne({ Id: id }).exec().then((doc) => {
            if (!doc) {
                new Guild({ Id: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
                return 1;
            }
            else {
                return doc.Day;
            }
        });
        return x;
    }

    static async setToday(id) {
        await Guild.updateOne({ Id: id }, { $set: { Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) } }, { upsert: true }).exec();
    }

    static async addDay(id, value) {
        await Guild.updateOne({ Id: id }, { $inc: { Day: value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }
    static async sumDay(id, value) {
        await Guild.updateOne({ Id: id }, { $inc: { Day: -value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }

    static async checkDay(id) {
        let data = await Guild.findOne({ Id: id }).exec();
        if (!data) return new Guild({ Id: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
        if (data.NextUpdate < Date.now()) {
            data.NextUpdate = new Date().setHours(24, 0, 0, 0);
            data.Day += 1;
        }
        data.save();
    }
}

module.exports = TimeManager;