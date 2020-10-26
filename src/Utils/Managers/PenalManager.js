const {GuildMember} = require("discord.js");

const Penal = require("../Schemas/Penal");
const Settings = require("../../Configuration/Settings.json");

class PenalManager{
    /**
     * @param {String} user 
     * @param {String} admin 
     * @param {String} type 
     * @param {Boolean} temporary 
     * @param {Number} startTime 
     * @param {Number} finishTime 
     */
    async addPenal(user, admin, type, reason, temporary = false, startTime = Date.now(), finishTime = undefined){
        let count = await Penal.countDocuments().exec();
        count = count == 0 ? 1 : count;
        return await new Penal({
            Id: count,
            Activity: true,
            User: user,
            Admin: admin,
            Type: type,
            Temporary: temporary,
            Time: startTime,
            Reason: reason,
            FinishTime: finishTime
        }).save();
    }
    /**
     * 
     * @param {String} id 
     */
    async removePenal(id){
        return await Penal.deleteOne({Id: id}).exec();   
    }

    /**
     * @param {GuildMember} member 
     */
    async setRoles(member, params = []){
        if(!member.manageable) return false;
        let roles = member.roles.cache.filter(role => role.managed).map(role => role.id).concat(params);
        member.roles.set(roles).catch();
        return true;
    }

    /**
     * 
     * @param {String} id 
     */
    async getPenal(id){
        return await Penal.findOne({Id: id}).exec();
    }

    /**
     * 
     * @param {String} user 
     * @param {Number} limit 
     */
    async getPenals(query, limit = undefined){
        if(!limit) return await Penal.find(query).exec();
        return await Penal.find(query).limit(limit).exec();
    }
}

module.exports = PenalManager;
module.exports.Types = {
    TEMP_MUTE: "TEMP_MUTE",
    MUTE: "MUTE",
    TEMP_VOICE_MUTE: "TEMP_VOICE_MUTE",
    VOICE_MUTE: "VOICE_MUTE",
    TEMP_JAIL: "TEMP_JAIL",
    JAIL: "JAIL",
    WARN: "WARN",
    KICK: "KICK",
    BAN: "BAN",
    SUSPECT: "SUSPECT"
}