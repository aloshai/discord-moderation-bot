const { GuildMember } = require("discord.js");
const Penal = require("../Models/Database/Penal");
const Settings = require("../Configuration/Settings.json");

class PenalManager {

    static Timeouts = new Map();

    /**
     * @param {String} user 
     * @param {String} admin 
     * @param {String} type 
     * @param {Boolean} temporary 
     * @param {Number} startTime 
     * @param {Number} finishTime 
     */
    static async addPenal(user, admin, type, reason, temporary = false, startTime = Date.now(), finishTime = undefined) {
        let count = await Penal.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;
        let penal = await new Penal({
            Id: count,
            Activity: true,
            User: user,
            Admin: admin,
            Type: type,
            Temporary: temporary,
            Time: startTime,
            Reason: reason,
            FinishTime: finishTime ? startTime + finishTime : finishTime
        }).save();

        if (temporary && finishTime && (finishTime < (1000 * 60 * 30))) {
            this.checkPenal(count, finishTime);
        }
        return penal;
    }

    static async checkPenal(id, time) {
        let timeout = setTimeout(async () => {
            this.Timeouts.delete(id);

            let penal = await Penal.findOne({ Id: id }).exec();
            if (!penal.Activity) return;

            let guild = global.Client.guilds.cache.get(Settings.Server.Id);
            if (!guild) return;

            let member = await guild.getMember(penal.User);
            if (!member) {
                penal.Activity = false;
            }
            else {
                return this.disableToPenal(penal, member);
            }
            penal.save();
        }, time);

        this.Timeouts.set(id, timeout);
    }

    static deleteTimeout(id) {
        let timeout = this.Timeouts.get(id);
        if (timeout) clearTimeout(timeout);
        return this.Timeouts.delete(id);
    }

    static async disableToPenal(penal, member) {
        if ((penal.Type == PenalManager.Types.TEMP_JAIL || penal.Type == PenalManager.Types.JAIL) && member.roles.cache.has(Settings.Penals.Jail.Role)) {
            let count = await Penal.countDocuments({ Activity: true, User: member.user.id, $or: [{ Type: PenalManager.Types.TEMP_JAIL }, { Type: PenalManager.Types.JAIL }] });
            count -= 1;
            if (count <= 0 && member.manageable) this.setRoles(member, Settings.Roles.Unregistered);
        }
        else if ((penal.Type == PenalManager.Types.MUTE || penal.Type == PenalManager.Types.TEMP_MUTE) && member.roles.cache.has(Settings.Penals.Mute.Role)) {
            let count = await Penal.countDocuments({ Activity: true, User: member.user.id, $or: [{ Type: PenalManager.Types.TEMP_MUTE }, { Type: PenalManager.Types.MUTE }] });
            count -= 1;
            if (count <= 0) member.roles.remove(Settings.Penals.Mute.Role).catch();
        }
        else if ((penal.Type == PenalManager.Types.VOICE_MUTE || penal.Type == PenalManager.Types.TEMP_VOICE_MUTE) && (member.roles.cache.has(Settings.Penals.VoiceMute.Role) || member.voice.serverMute)) {
            let count = await Penal.countDocuments({ Activity: true, User: member.user.id, $or: [{ Type: PenalManager.Types.TEMP_VOICE_MUTE }, { Type: PenalManager.Types.VOICE_MUTE }] });
            count -= 1;
            if (count <= 0) member.roles.remove(Settings.Penals.VoiceMute.Role).catch();
            if (member.voice.channelID && member.voice.serverMute) member.voice.setMute(false).catch();
        }
        penal.Activity = false;
        penal.save();
    }

    /**
     * 
     * @param {String} id 
     */
    static async removePenal(id) {
        return await Penal.deleteOne({ Id: id }).exec();
    }

    /**
     * @param {GuildMember} member 
     * @param {Array<String>} params
     */
    static async setRoles(member, params = []) {
        if (!member.manageable) return false;
        let roles = member.roles.cache.filter(role => role.managed).map(role => role.id).concat(params);
        member.roles.set(roles).catch();
        return true;
    }

    /**
     * 
     * @param {String} id 
     */
    static async getPenal(id) {
        return await Penal.findOne({ Id: id }).exec();
    }
    /**
     * 
     * @param {Object} query 
     */
    static async getPenalToQuery(query) {
        return await Penal.findOne(query).exec();
    }
    /**
     * 
     * @param {String} user 
     * @param {Number} limit 
     */
    static async getPenals(query, limit = undefined) {
        if (!limit) return await Penal.find(query).exec();
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