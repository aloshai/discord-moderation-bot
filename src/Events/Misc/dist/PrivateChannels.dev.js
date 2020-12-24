"use strict";

var _require = require("discord.js"),
    VoiceState = _require.VoiceState;

var SettingsJSON = require("../../Configuration/Settings.json");

var Settings = SettingsJSON.PrivHub;
/**
 * 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState
 */

module.exports = function _callee(oldState, newState) {
  var mainChannel, oldChannel, _oldChannel;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          mainChannel = oldState.guild.channels.cache.get(Settings.Room);

          if (mainChannel) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          if (!(!oldState.channelID && newState.channelID && newState.channel.parentID == mainChannel.parentID && newState.channelID == mainChannel.id)) {
            _context.next = 8;
            break;
          }

          newState.guild.channels.create("".concat(Settings.Symbol, " ").concat(newState.member.displayName, "'s Nature"), {
            type: "voice",
            parent: mainChannel.parentID,
            permissionOverwrites: mainChannel.permissionOverwrites.clone().set(newState.member.id, {
              id: newState.member.id,
              allow: ["MANAGE_CHANNELS"]
            })
          }).then(function (channel) {
            if (newState.member && newState.member.voice.channelID) newState.member.voice.setChannel(channel);
          });
          return _context.abrupt("return");

        case 8:
          if (!(oldState.channelID && newState.channelID)) {
            _context.next = 15;
            break;
          }

          oldChannel = oldState.channel;
          if (oldChannel.position > mainChannel.position && oldChannel.parentID == mainChannel.parentID && oldChannel.members.size <= 0 && !oldChannel.deleted) oldChannel["delete"]()["catch"](undefined);

          if (newState.channelID == mainChannel.id && newState.channel.parentID == mainChannel.parentID) {
            newState.guild.channels.create("".concat(Settings.Symbol, " ").concat(newState.member.displayName, "'s Nature"), {
              type: "voice",
              parent: mainChannel.parentID,
              permissionOverwrites: mainChannel.permissionOverwrites.clone().set(newState.member.id, {
                id: newState.member.id,
                allow: ["MANAGE_CHANNELS"]
              })
            }).then(function (channel) {
              if (newState.member && newState.member.voice.channelID) newState.member.voice.setChannel(channel);
            });
          }

          return _context.abrupt("return");

        case 15:
          if (oldState.channelID && oldState.channel.parentID == mainChannel.parentID && !newState.channelID) {
            _oldChannel = oldState.channel;
            if (_oldChannel.position > mainChannel.position && _oldChannel.members.size <= 0 && !_oldChannel.deleted) _oldChannel["delete"]()["catch"](undefined);
          }

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  Event: "voiceStateUpdate"
};