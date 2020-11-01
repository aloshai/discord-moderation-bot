const TimeManager = require("../Utils/Managers/TimeManager");
const Settings = require("../Configuration/Settings.json");


module.exports = () => {
    const tm = new TimeManager();
    setInterval(async () => {
        await tm.checkDay(Settings.Server.Id);
    }, 1000);
}

module.exports.config = {
    Event: "message"
}