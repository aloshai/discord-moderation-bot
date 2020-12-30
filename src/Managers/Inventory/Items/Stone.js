const Item = require("../Item");

class Stone extends Item {
    constructor(){
        super("STONE", "Taş", "Bu taş anasını satayım ne yapacaksın?", "MINE", "stone");

        this.Sell = 1;
    }
}

module.exports = Stone;