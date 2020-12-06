const Item = require("../Item");

class SourceIron extends Item {
    constructor(){
        super("SOURCE_IRON", "Demir", "Demir ağır bir elementtir. Nereden bakarsan bak 1 kilo demir 4-5 kilo falan vardır.", "MINE", "iron");

        this.Sell = 7;
        this.RarityMin = 0.3;
        this.RarityMax = 0.45;
    }
}

module.exports = SourceIron;