const { Message, TextChannel, Guild, MessageEmbed, Util, GuildMember } = require("discord.js");

const client = global.Client;

Date.prototype.toTurkishFormatDate = function (format = "dd MM yyyy") {
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

Date.prototype.toTurkishDate = function () {
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

client.users.getUser = GetUser;
client.getUser = GetUser;

module.exports = {
    GetUser
}