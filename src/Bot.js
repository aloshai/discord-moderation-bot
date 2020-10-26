const {Client, Collection} = require("discord.js");
const client = global.Client;

const Config = require("./Configuration/Config.json");

const EventManager = require("./Utils/Managers/EventManager");
const em = new EventManager();

em.addEvent("CommandHandler");
em.addEvent("Timer.js");

em.addEvent("Stats System/OnMessageStat");
em.addEvent("Stats System/OnVoiceReady");
em.addEvent("Stats System/OnVoiceStateUpdate");

em.addEvent("Penal System/OnMemberUpdate");
em.addEvent("Penal System/OnReady");
em.addEvent("Penal System/OnVoiceStateUpdate");

client.login(Config.Token).catch(err => console.error(err));