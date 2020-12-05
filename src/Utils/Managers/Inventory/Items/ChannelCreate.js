const Item = require("../Item");

class NameChanger extends Item {
    constructor(){
        super("CHANNEL_CREATE", "Kanal Oluşturma", "Sunucu içerisinde belirli bir yere kendine özel bir kanal oluşturma hakkı.", "USEFUL", "nametag");
    }
}

module.exports = NameChanger;