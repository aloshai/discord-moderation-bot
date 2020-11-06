const {GuildMember} = require("discord.js");

GuildMember.prototype.setRoles = function(params = []){
    let roles = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(params);
    return this.roles.set(roles);  
}