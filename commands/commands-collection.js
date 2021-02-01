// DEPENDENCIES
const Command = require('./command-class.js');
const genUtils = require('../utils/general.js');
const data = require('../utils/guild-data-helpers/readwrite-data.js');

// GENERAL BOT COMMANDS
const commands = new Map();

commands.set("help",
  new Command({
    name: "help",
    botOwnerOnly: false,
    moderatorOnly: false,
    args: "*optional args*  [command(s) to enquire about]",
    desc: "look up all or specific commands e.g. ping togglefeature",
    execute: (msg, args) => {
      const matchedCommands = args.filter( arg => { return commands.has(arg); });
      const commandsToShow = (matchedCommands.length < 1) ? commands : matchedCommands.map( cmd => { return commands.get(cmd); });
      const helpinfo = (() => {
        let txt = "Here are the commands you requested!";
        commandsToShow.forEach( cmd => {
          txt += "\n\n:white_small_square:\t**" + cmd.name.toUpperCase() + "**\t`" + cmd.format(msg) + "`\n\t\t  " + cmd.desc;
        });
        return txt + "\n\n(￣^￣)ゞ";
      })();
      return msg.channel.send(helpinfo);
    }
  })
);

commands.set("ping",
  new Command({
    name: "ping",
    botOwnerOnly: false,
    moderatorOnly: false,
    args: "",
    desc: "answer your ping",
    execute: (msg, args) => {
      return msg.channel.send(`pong!`);
    }
  })
);

commands.set("togglefeature",
  new Command({
    name: "togglefeature",
    botOwnerOnly: false,
    moderatorOnly: true,
    args: "[name of feature] [toggle state]",
    desc: "toggle a feature state e.g. onlyPostToBotChannel off",
    execute: (msg, args) => {
      const guild = msg.channel.guild;
      // will return current value of feature which should be typeof boolean (or it will return the whole features object if the feature does not exist)
      const featureExists = (typeof data.read('features.'+args[0], 'config', guild) === "boolean") ? true : false;
      const toggle = genUtils.isYesNoOther(args[1]);
      if(!featureExists || toggle===3){
        return msg.channel.send("Please use the format:\t`"+ commands.get("togglefeature").format(msg) +"`");
      } else {
        const value = (toggle===1) ? true : false;
        data.write('features.'+args[0], 'config', guild, value);
        return msg.channel.send(`Feature "${args[0]}" has been toggled to ${value}.`);
      }
    }
  })
);

commands.set("setpreferences",
  new Command({
    name: "setpreferences",
    botOwnerOnly: false,
    moderatorOnly: true,
    args: "[name of preference] [its new value]",
    desc: "configure your preferences for the bot within this server e.g. msgChannel general",
    execute: (msg, args) => {
      const guild = msg.channel.guild;
      // will return current value of preference which should be typeof string (or it will return the whole preferences object if the preference does not exist)
      const featureExists = (typeof data.read('preferences.'+args[0], 'config', guild) === "string") ? true : false;
      const checkingValueValidity = (args[0]!=="prefix") ? true : (args.length < 2) ? true : false;
      if(!featureExists && !checkingValueValidity){
        return msg.channel.send("Please use the format:\t`"+ commands.get("setpreferences").format(msg) +"`");
      } else {
        const value = '"' + args[1] + '"';
        data.write('preferences.'+args[0], 'config', guild, value);
        return msg.channel.send(`Preference for "${args[0]}" has been set to ${value}.`);
      }
    }
  })
);

/* template below:

commands.set("xxx",
  new Command({
    name: "xxx",
    botOwnerOnly: false,
    moderatorOnly: false,
    args: "xxx",
    desc: "xxx",
    execute: (msg, args) => {
      return msg.channel.send(`xxx`);
    }
  })
);

*/

module.exports = commands;
