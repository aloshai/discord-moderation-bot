"use strict";

var client = global.Client;

var _require = require("discord.js"),
    Client = _require.Client;

var Config = require("./Configuration/Config.json");

var EM = require("./Utils/Managers/EventManager");

require("./Utils/Managers/InviteManager");

EM.addEvent("CommandHandler");
EM.addEvent("Timer.js");
EM.addEvent("Stat/OnMessageStat");
EM.addEvent("Stat/OnVoiceReady");
EM.addEvent("Stat/OnVoiceStateUpdate");
EM.addEvent("Penal/OnMemberUpdate");
EM.addEvent("Penal/OnReady");
EM.addEvent("Penal/OnVoiceStateUpdate");
EM.addEvent("Misc/Welcome.js");
EM.addEvent("Misc/PrivateChannels.js");
EM.addEvent("Market/CaseDrop.js");
EM.addEvent("Friends/OnVoiceStateUpdate");
EM.addEvent("Friends/OnVoiceReady");
client.on("ready", function () {
  return console.log("Bot is ready.");
});

require("./Utils/Helper");

require("./Utils/Patch");

client.login(Config.Token)["catch"](console.error);