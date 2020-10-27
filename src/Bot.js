const client = global.Client;
const Config = require("./Configuration/Config.json");

const EventManager = require("./Utils/Managers/EventManager");
const EM = new EventManager();

EM.addEvent("CommandHandler");
EM.addEvent("Timer.js");

EM.addEvent("StatsSystem/OnMessageStat");
EM.addEvent("StatsSystem/OnVoiceReady");
EM.addEvent("StatsSystem/OnVoiceStateUpdate");

EM.addEvent("PenalSystem/OnMemberUpdate");
EM.addEvent("PenalSystem/OnReady");
EM.addEvent("PenalSystem/OnVoiceStateUpdate");

client.on("ready", () => console.log("bot hazır."))

require("./Utils/Helper");

client.login(Config.Token).catch(console.error);