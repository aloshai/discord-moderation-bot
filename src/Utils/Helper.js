const {Message, TextChannel, Guild, MessageEmbed, Util,  GuildMember} = require("discord.js");

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

Date.prototype.toTurkishFormatDate = function(format = "dd MM yyyy") {
    var date = this,
            day = date.getDate(),
            weekDay = date.getDay(),
            month = date.getMonth(),
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

    var monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    var dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

    format = format.replace("mm", month.toString().padStart(2, "0"));

    format = format.replace("MM", monthNames[month]);

    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    format = format.replace("dd", day.toString().padStart(2, "0"));

    format = format.replace("DD", dayNames[weekDay]);

    if (format.indexOf("HH") > -1) {
        format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("hh") > -1) {
        if (hours > 12) {
            hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }
        format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ii") > -1) {
        format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ss") > -1) {
        format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    }

    return format;
};

Date.prototype.toTurkishDate = function() {
    let monthNames = [
        "Ocak", "Şubat", "Mart",
        "Nisan", "Mayıs", "Haziran", "Temmuz",
        "Ağustos", "Eylül", "Ekim",
        "Kasım", "Aralık"
      ];
      let date = this;
      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
      return `${day} ${monthNames[monthIndex]} ${year}`;
}

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