const {User, GuildMember} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {User} oldUser 
 * @param {User} newUser 
 */
module.exports = async (oldUser, newUser) => {
    if(oldUser.bot || newUser.bot || (oldUser.username == newUser.username)) return;

    let guild = oldUser.client.guilds.cache.get(Settings.Server.Id);

    let tagRole = guild.roles.cache.get(Settings.Tag.Role);
    if(!tagRole) return;

    /**
     * @type {GuildMember}
     */
    let member = await guild.getMember(oldUser.id);
    if(!member || (member && member.roles.cache.has(Settings.Penals.Jail.Role) || member.roles.cache.has(Settings.Penals.Suspect.Role) && Settings.Roles.Unregistered.some(e => member.roles.cache.has(e)))) return;

    let channel = guild.channels.cache.get(Settings.Tag.Log);

    if(oldUser.username.includes(Settings.Tag.Symbol) && !newUser.username.includes(Settings.Tag.Symbol)){ // Tagdan ayrılma durumu :D
        if(member.manageable && Settings.Tag.Symbol_2.length > 0) member.setNickname(member.displayName.replace(Settings.Tag.Symbol, Settings.Tag.Symbol_2));
        member.setRoles(member.roles.cache.filter(role => role.position < tagRole.position).map(role => role.id));
        if(channel) channel.send(`${oldUser}(${oldUser.id}) kişisi \`${Settings.Tag.Symbol}\` sembolü üstünden çıkardı ve takımdan çıkarıldı.`);
    }
    else if(!oldUser.username.includes(Settings.Tag.Symbol) && newUser.username.includes(Settings.Tag.Symbol)){ // Taga girme durumu :D
        if(member.manageable && Settings.Tag.Symbol_2.length > 0) member.setNickname(member.displayName.replace(Settings.Tag.Symbol_2, Settings.Tag.Symbol));
        member.roles.add(tagRole);
        if(channel) channel.send(`${oldUser}(${oldUser.id}) kişisi \`${Settings.Tag.Symbol}\` sembolü üstüne ekledi ve takıma eklendi.`);
    }
}

module.exports.config = {
    Event: "userUpdate"
}