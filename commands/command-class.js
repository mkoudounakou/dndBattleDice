// DEPENDENCIES

const data = require('../utils/guild-data-helpers/readwrite-data.js');

// CLASS
module.exports = class Command {
  constructor(cmd) {
    this._name = cmd.name; // required field - this class will eventually be exported with intention of becoming key/value pair data type
    this._botOwnerOnly =   (arguments.length >= 1 && typeof cmd.botOwnerOnly  !== "undefined") ? cmd.botOwnerOnly                    : false             ;
    this._moderatorOnly =  (arguments.length >= 1 && typeof cmd.moderatorOnly !== "undefined") ? cmd.moderatorOnly                   : false             ;
    this._args =           (arguments.length >= 1 && typeof cmd.args          !== "undefined") ? cmd.args                            : ""                ;
    this._desc =           (arguments.length >= 1 && typeof cmd.desc          !== "undefined") ? `Asks D&DBattleDice to ${cmd.desc}` : ""                ;
    this._execute =        (arguments.length >= 1 && typeof cmd.execute       !== "undefined") ? cmd.execute                         : (msg, args) => {} ;
  }

  // READONLY
  get name() { return this._name; }
  get botOwnerOnly() { return this._botOwnerOnly; }
  get moderatorOnly() { return this._moderatorOnly; }
  get args() { return this._args; }
  get desc() { return this._desc; }

  // FUNCTIONS
  execute(msg, args) {
    this._execute(msg, args);
    return;
  }

  format(msg) {
    const guild = msg.channel.guild;
    const prefix = data.read('preferences.prefix', 'config', guild);
    return (this.args !== "") ? `${prefix}${this.name} ${this.args}` : `${prefix}${this.name}`;
  }
}
