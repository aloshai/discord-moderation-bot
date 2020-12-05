const Item = require("../Item");

class SourceDiamond extends Item {
    constructor(){
        super("SOURCE_DIAMOND", "Elmas", "Parlak, parlak- ÇOK PARLAK!", "MINE", "diamond");

        this.Sell = 80;
        this.RarityMin = 0.9;
        this.RarityMax = 0.93;
    }
}

module.exports = SourceDiamond;