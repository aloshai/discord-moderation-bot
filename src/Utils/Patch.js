const { GuildMember, Guild, TextChannel, Message, MessageEmbed } = require("discord.js");
const webhooks = {};
const client = global.Client;

Number.prototype.toHumanize = function (options) {
    options = options || {};
    let d = options.delimiter || ',';
    let s = options.separator || '.';
    let n = this.toString().split('.');
    n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + d);
    return n.join(s);
};

GuildMember.prototype.setRoles = function (params = []) {
    let roles = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(params);
    return this.roles.set(roles);
}

Guild.prototype.findEmoji = function (name) {
    let react = this.emojis.cache.find(emoji => emoji.name == name);
    return react;
}


/**
 * 
 * @param {String} id
 * @returns {GuildMember} 
 */
Guild.prototype.getMember = async function (id) {
    let member = this.member(id);
    if (!member) {
        try {
            member = await this.members.fetch(id);
        }
        catch (err) {
            member = undefined;
        }
    }
    return member;
}

Guild.prototype.log = async function log(admin, user, document, channelId) {
    let channel = this.channels.cache.get(channelId);
    if (channel) {
        let embed = new MessageEmbed()
            .setThumbnail(admin.avatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`${admin}(${admin.id}) tarafından ${user}(${user.id}) kişisi **"${document.Reason}"** sebebi ile ${document.Type} cezası aldı. (Ceza Numarası: #${document.Id})`)
            .addField("Ceza Bilgisi", `
        **Ceza Numarası:** \`#${document.Id}\`
        **Ceza Tipi:** ${document.Type}
        `)
            .addField("Yetkili ve Kullanıcı", `
        **Yetkili:** ${admin}(${admin.id})
        **Kullanıcı:** ${user}(${user.id})        
        `);
        channel.csend(embed);
    }
}

TextChannel.prototype.csend = async function (content, options) {
    if (webhooks[this.id]) return (await webhooks[this.id].send(content, options));
    let webhookss = await this.fetchWebhooks();
    let wh = webhookss.find(e => e.name == client.user.username),
        result;
    if (!wh) {
        wh = await this.createWebhook(client.user.username, {
            avatar: client.user.avatarURL()
        });
        webhooks[this.id] = wh;
        result = await wh.send(content, options);
    } else {
        webhooks[this.id] = wh;
        result = await wh.send(content, options);
    }
    return result;
};

/*Message.prototype.reply = async function (content, options) {
    if (webhooks[this.channel.id]) return (await webhooks[this.channel.id].send(`${this.author}, ${content}`, options));
    let webhookss = await this.channel.fetchWebhooks();
    let wh = webhookss.find(e => e.name == client.user.username),
        result;
    if (!wh){
        wh = await this.channel.createWebhook(client.user.username, {
            avatar: client.user.avatarURL()
        });
        webhooks[this.channel.id] = wh;
        result = await wh.send(`${this.author}, ${content}`, options);
    } else{
        webhooks[this.channel.id] = wh;
        result = await wh.send(`${this.author}, ${content}`, options);
    }
    return result;
};*/