const client = global.Client;
const Config = require("./Configuration/Config.json");

const EM = require("./Utils/Managers/EventManager");

EM.addEvent("CommandHandler");
EM.addEvent("Timer.js");

EM.addEvent("Stat/OnMessageStat");
EM.addEvent("Stat/OnVoiceReady");
EM.addEvent("Stat/OnVoiceStateUpdate");

EM.addEvent("Penal/OnMemberUpdate");
EM.addEvent("Penal/OnReady");
EM.addEvent("Penal/OnVoiceStateUpdate");

client.on("ready", () => console.log("Bot is ready."))

require("./Utils/Helper");
require("./Utils/Util");
require("./Utils/Patch");

client.login(Config.Token).catch(console.error);