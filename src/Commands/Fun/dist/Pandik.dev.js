"use strict";

var _require = require("discord.js"),
    Message = _require.Message,
    Client = _require.Client,
    MessageEmbed = _require.MessageEmbed;

var Settings = require("../../Configuration/Settings.json");

var Task = require("../../Utils/Schemas/Task");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */


module.exports.execute = function _callee(client, message, args) {
  var victim;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          victim = message.mentions.users.first();

          if (!(!victim || victim.id == message.author.id)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", message.reply("k-kendini mi pandikleyeceksin 😳"));

        case 3:
          message.reply("".concat(victim, " \xFCyesini **pandikledi** \xE7abuk ka\xE7\u0131r kendini, ba\u015F\u0131n belada!"));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.settings = {
  Commands: ["pandik"],
  Usage: "pandik <@user>",
  Description: "Birisini pandikleyebilirsin.",
  Category: "Fun",
  cooldown: 5000,
  Activity: true
};