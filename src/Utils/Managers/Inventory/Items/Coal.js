const Item = require("../Item");

class SourceCoal extends Item {
    constructor(){
        super("SOURCE_COAL", "Kömür", "Bu bir kömür. Çok işlevsel bir şey gibi görünebilir ancak görüşünü sizi yanıltmasın.", "MINE", "coal");

        this.Sell = 3;
        this.RarityMin = 0.4;
        this.RarityMax = 0.7;
    }
}

module.exports = SourceCoal;