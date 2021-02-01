// DEPENDENCIES

const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config('.env');
const genUtils = require('./utils/general.js');
const botUtils = require('./utils/bot-specific.js');
const data = require('./utils/guild-data-helpers/readwrite-data.js');
const commands = require('./commands/commands-collection.js');

// CONSTANTS

const token = process.env.BOT_TOKEN;
const botOwnerID = process.env.OWNER_ID;
const botID = process.env.BOT_ID;
const botInviteUrl = `https://discordapp.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=8`;

// PROCESSES

async function runProcess(guild, channel) {
	try {
	  // remember to use 'await' for retreiving from or executing commands with discord api, e.g. 'role = await guild.roles.create()' or 'await member.roles.add()'.
    console.log('process executed.');
	} catch (err) {
	  console.warn('Error during process execution.');
	  console.warn(err);
	}
}

// EVENTS

client.on('ready', () => {
	console.log('D&DBattleDice is now connected.');
	const guilds = client.guilds.cache;
	if (!guilds) return;
	guilds.forEach( guild => {
    const channel = botUtils.getChannelToSendTo(guild);
	  if (!channel) return;
    const prefix = data.read('preferences.prefix', 'config', guild);
    let msg = "**Hi, nice to meet you!**";
    msg +=  "\n\nI'm here to help you calculate your character's best move in battle whilst keeping track of resource costs..";
    msg +=  "\n        *e.g. spell slots, spell duration, charges, the action and bonus action allowance*";
    msg +=  "\nI consider class features and magical weapon/spell effects..";
    msg +=  "\n        *which can increase your damage, boost stats or aid in resource cost!*";
    msg +=  "\nYou'll need to create a character profile with me before your session begins.";
    msg +=  "\n\nType   `&_help`   to begin";
    channel.send(msg);
    runProcess(guild, channel);
  });
});

//  ACTION COMMANDS

client.on('message', async (msg) => {
  try {
      // ignore direct messages
      const guild = msg.channel.guild;
      if (!guild) return;

      // ignore commands that don't start with the correct prefix
      const content = msg.content;
      const prefix = data.read('preferences.prefix', 'config', guild);
      if (!content.startsWith(prefix)) return;

      // extract the parts and name of the command & get the requested command, if there is one
      const parts = content.split(' ').map(s => s.trim()).filter(s => s);
      const commandName = parts[0].substr(prefix.length);
      const commandExists = commands.has(commandName);
      if (!commandExists) return;

      // if this command is only for the bot owner, refuse to execute it for any other user
      const authorIsBotOwner = msg.author.id === botOwnerID;
      if (commands.get(commandName).botOwnerOnly && !authorIsBotOwner) {
          return await msg.channel.send(`Sorry, you need clearance to use this command *(Bot Owner Only)*`);
      }

      // if this command is only for moderators, refuse to execute it for any other user
	    const member = msg.channel.guild.members.cache.get(msg.author.id);
      const authorIsModerator = member.roles.cache.some( r => r.name === 'Mod');
      if (commands.get(commandName).moderatorOnly && !authorIsModerator && !authorIsBotOwner) {
          return await msg.channel.send(`Sorry, you need clearance to use this command *(Mod Role Only)*`);
      }

      // separate the command arguments from the command prefix and name & execute the command
      const args = parts.slice(1);
      await commands.get(commandName).execute(msg, args);
  } catch (err) {
      console.warn('Error during message event and command execution.');
      console.warn(err);
  }
});

// INSTANTIATE

client.on('error', err => {
 console.warn('Error during runtime.');
 console.warn(err);
});

client.login(token);
