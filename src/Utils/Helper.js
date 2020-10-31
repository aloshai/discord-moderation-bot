const {Message, TextChannel, Guild, MessageEmbed, GuildMember} = require("discord.js");

const client = global.Client;
const webhooks = {};
/**
 * 
 * @param {String} id
 * @returns {GuildMember} 
 */
Guild.prototype.getMember = async function (id) {
    let member = this.member(id);
    if(!member) member = await this.members.fetch(id);
    return member;
}

Guild.prototype.log = async function log(admin, user, document, channelId) {
    let channel = this.channels.cache.get(channelId);
    if(channel){
        let embed = new MessageEmbed()
        .setThumbnail(admin.avatarURL({dynamic: true}))
        .setColor("RANDOM")
        .setDescription(`${admin}(${admin.id}) tarafından ${user}(${user.id}) kişisi **"${document.Reason}"** sebebi ile ${document.Type} cezası aldı. (Ceza Numarası: #${document.Id})`)
        .addField("Ceza Bilgisi",`
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

Message.prototype.reply = async function (content, options) {
    if (webhooks[this.channel.id]) return (await webhooks[this.channel.id].send(`${this.author}, ${content}`, options));
    let webhookss = await this.channel.fetchWebhooks();
    let wh = webhookss.find(e => e.name == client.user.username),
        result;
    if (!wh) {
        wh = await this.channel.createWebhook(client.user.username, {
            avatar: client.user.avatarURL()
        });
        webhooks[this.channel.id] = wh;
        result = await wh.send(`${this.author}, ${content}`, options);
    } else {
        webhooks[this.channel.id] = wh;
        result = await wh.send(`${this.author}, ${content}`, options);
    }
    return result;
};

async function GetUser(id) {
    try {
        return await client.users.fetch(id);
    } catch (error) {
        return undefined;
    }
};

module.exports = {
    GetUser
}