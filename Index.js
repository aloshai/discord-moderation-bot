const Config = global.Config = require("./src/Configuration/Config.json");

const { Client } = require("discord.js");
const client = global.Client = new Client({
  fetchAllMembers: true
});

const fs = require("fs");
let CommandId = 0;
const Commands = global.Commands = new Array();

let dirs = fs.readdirSync("./src/Commands", { encoding: "utf8" });
dirs.forEach(dir => {
  let files = fs.readdirSync(`./src/Commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
  files.forEach(file => {
    let ref = require(`./src/Commands/${dir}/${file}`);
    if (!ref.settings) return console.error(`[ Commands/${dir}/${file} ] path to not loaded.`)

    if (ref.onLoad != undefined && typeof ref.onLoad == "function") ref.onLoad(client);
    ref.settings.id = CommandId;
    Commands.push(ref);
    console.log(`${dir}/${file} is loaded. [ COMMAND ID ] ${CommandId}`);
    CommandId += 1;
  });
});


const InventoryManager = require("./src/Managers/Inventory/InventoryManager");
let items = [];
let fileNames = fs.readdirSync("./src/Managers/Inventory/Items", "utf-8").filter(e => e.endsWith(".js"));
fileNames.forEach(fileName => {
    let item = require(`./src/Managers/Inventory/Items/${fileName}`);
    items.push(new item());
});

InventoryManager.Items = items;

const mongoose = require("mongoose");
mongoose.connect(Config.DatabaseUrl.replace("<dbname>", Config.DatabaseName), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB is connected.")
  require("./src/Bot.js");
});