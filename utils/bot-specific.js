// DEPENDENCIES

const data = require('./guild-data-helpers/readwrite-data.js');

// HELPER FUNCTIONS

module.exports.getChannelToSendTo = function(guild) {
  // getting config data from guild data folder
  const onlyPostToBotChannel = data.read('features.onlyPostToBotChannel', 'config', guild);
  const botChannel = data.read('preferences.msgChannel', 'config', guild);

  // actioning request
  const channels = guild.channels.cache.filter(ch => ch.type === "text");

  // Discord api returns channels in the structure type of 'Collection() [Map]'.
  // To access the first value without knowing the key I use '.values().next().value'.
  // as suggested via: https://til.hashrocket.com/posts/c8e6611985-get-first-value-from-javascript-map
  return (onlyPostToBotChannel) ? channels.find(ch => ch.name === botChannel) : channels.values().next().value;
}
