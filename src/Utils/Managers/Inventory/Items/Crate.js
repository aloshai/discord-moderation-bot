const Item = require("../Item");

class Crate extends Item {
    constructor(){
        super("COMMON_CRATE", "Altın Sandığı", "Bir miktar para çıkarmak için kullanılır.", "CRATE", "coincrate");

        this.Min = 5;
        this.Max = 50;
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

module.exports = Crate;