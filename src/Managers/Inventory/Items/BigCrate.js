const Item = require("../Item");

class CoinCrate extends Item {
    constructor(){
        super("SOURCE_BIG_CRATE", "Büyük Elmas Sandığı", "Bir miktar para çıkarmak için kullanılır.", "CRATE", "coincrate");

        this.Min = 2000;
        this.Max = 5000;
        this.RarityMin = 0.56;
        this.RarityMax = 0.57;
    }

    /**
     * @param {Number} min 
     * @param {Number} max
     * @returns {Number}
     */
    open(){
        let rnd = Math.floor(Math.random() * (this.Max - this.Min) + this.Min);
        return rnd;
    }
}

module.exports = CoinCrate;