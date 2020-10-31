const client = global.Client;
const Config = require("./Configuration/Config.json");

const EventManager = require("./Utils/Managers/EventManager");
const EM = new EventManager();

const ChartManager = require("./Utils/Managers/ChartManager");
const CM = new ChartManager();

CM.getImageFromData({
    title:{
        text: "My First Chart in CanvasJS"              
    },
    data: [              
    {
        type: "column",
        dataPoints: [
            { label: "apple",  y: 10  },
            { label: "orange", y: 15  },
            { label: "banana", y: 25  },
            { label: "mango",  y: 30  },
            { label: "grape",  y: 28  }
        ]
    }
    ]
})

return;

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