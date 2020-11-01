const client = global.Client;
const Config = require("./Configuration/Config.json");

const EventManager = require("./Utils/Managers/EventManager");
const EM = new EventManager();

EM.addEvent("CommandHandler");
EM.addEvent("Timer.js");

EM.addEvent("Stats/OnMessageStat");
EM.addEvent("Stats/OnVoiceReady");
EM.addEvent("Stats/OnVoiceStateUpdate");

EM.addEvent("Penals/OnMemberUpdate");
EM.addEvent("Penals/OnReady");
EM.addEvent("Penals/OnVoiceStateUpdate");

client.on("ready", () => console.log("Bot hazır."))

require("./Utils/Helper");
client.login(Config.Token).catch(console.error);