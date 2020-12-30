const TimeManager = require("../Managers/TimeManager");
const Settings = require("../Configuration/Settings.json");

module.exports = () => {
    const tm = TimeManager;
    setInterval(async () => {
        await tm.checkDay(Settings.Server.Id);
    }, 5000);
}

module.exports.config = {
    Event: "ready"
}