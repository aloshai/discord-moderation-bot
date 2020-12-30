const Item = require("../Item");
const Stat = require("../../../Models/Database/Stat");

class VoiceToChat extends Item {
    constructor(){
        super("VOICETOCHAT", "Sesi, Mesaja Çevir!", "Üstünüzdeki mesaj aktivitesini kullanarak bunu sesli şeye çevirir.", "USEABLE", "voiceStats");

        this.PriceType = "STAT_VOICE";
        this.Price = 100; // minutes
        this.Give = 2500; // messages
    }

    /**
    * 
    * @param {String} id 
    */
    async use(id){
        await Stat.updateOne({Id: id}, {$inc: {AllMessage: this.Give}}).exec();
    }
}

module.exports = VoiceToChat;