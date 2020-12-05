const Item = require("../Item");

class SourceGold extends Item {
    constructor(){
        super("SOURCE_GOLD", "Altın", "Güneş gözlüğünü hazırla çünkü altın değerli bir madendir. Çıktığı yer, bulunduğu ortam ve opaklığı epey göz alıcıdır.", "MINE", "gold");

        this.Sell = 30; 
        this.RarityMin = 0.93;
        this.RarityMax = 1;
    }
}

module.exports = SourceGold;