"use strict";

var _require = require("discord.js"),
    Message = _require.Message,
    Client = _require.Client,
    MessageEmbed = _require.MessageEmbed;

var FriendShip = require("../../Utils/Schemas/FriendShip");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */


module.exports.execute = function _callee(client, message, args) {
  var data, friends, embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(FriendShip.findOne({
            Id: message.author.id
          }));

        case 2:
          data = _context.sent;

          if (data) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", message.reply("s-sanırsam hiç arkadaşın yok 😳"));

        case 5:
          friends = Object.keys(data.Friends).sort(function (a, b) {
            return data.Friends[b] - data.Friends[a];
          }).splice(0, 15);
          embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({
            dynamic: true
          })).setTimestamp();
          embed.setDescription("Arkada\u015Fl\u0131k sistemi sunucu i\xE7erisinde vakit ge\xE7irdi\u011Fin insanlar\u0131n/gruplar\u0131n seninle olan arkada\u015Fl\u0131k puanlar\u0131n\u0131 g\xF6sterir. Unutma ki buradaki puanlama sistemi tamamen matematiksel hesaplamalarla \xE7al\u0131\u015F\u0131r, arkada\u015Flar\u0131nla arandaki ili\u015Fkini bilemez.");
          embed.addField("Arkadaşlarım", "".concat(friends.map(function (friend) {
            return "<@".concat(friend, ">: **").concat(data.Friends[friend].toFixed(2), "** puan");
          }).join("\n")));
          message.channel.csend(embed);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.settings = {
  Commands: ["friends", "arkadaslarım", "ships", "ship", "friend"],
  Usage: "friends",
  Description: "Sunucu içerisinde kimlerle ya da hangi gruplarla daha sık vakit geçirdiğini görebileceğin bir sistem.",
  Category: "Ship",
  cooldown: 5000,
  Activity: true
};