const Item = require("../Item");
const Stat = require("../../../Models/Database/Stat");

class ChatToVoice extends Item {
    constructor(){
        super("CHATTOVOICE", "Mesajı, Sese çevir!", "Üstünüzde bulunan ses aktivitesini kullanarak size sohbet mesajı ekler.", "USEABLE", "voiceStats");

        this.PriceType = "STAT_CHAT";
        this.Price = 5000; // messages
        this.Give = 100; // minutes
    }

    /**
    * 
    * @param {String} id 
    */
    async use(id){
        await Stat.updateOne({Id: id}, {$inc: {AllVoice: (this.Give * (1000 * 60))}}).exec();
    }
}

module.exports = ChatToVoice;