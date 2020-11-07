class EventManager{
    static addEvent(fileName){
        let ref = require(`../../Events/${fileName}`);
        console.log(ref);
        global.Client.on(ref.config.Event, ref);
        console.log(`[ EVENT ] ${fileName} is loaded.`);
    }
}

module.exports = EventManager;