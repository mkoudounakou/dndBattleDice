// DEPENDENCIES AND CONSTANTS

const fs = require('fs');
const template = require('./template-data.js');
const pathToGuildData = './guild-data/';
const filesFromTemplate = new Map([
  ['config.json', JSON.stringify(template.guildConfig)],
  ['data.json', JSON.stringify(template.guildData)]
]);

// HELPER FUNCTIONS

function createFilesFromTemplate(dirGuildData){
  console.log(filesFromTemplate);
  filesFromTemplate.forEach((value, key) => {
    console.log(key);
    fs.writeFileSync(dirGuildData + "/" + key, value);
  });
  return;
}

function checkFilesExist(folderName){
  const dirGuildData = pathToGuildData + folderName;
  // if not, create file from template
  const createDirectory = (dir) => {
    let pathExists = true;
    try {
      fs.statSync(dir);
    } catch(err) {
      pathExists = false;
    }
    if(pathExists === false){
      fs.mkdirSync(dir, { recursive: true });
      createFilesFromTemplate(dirGuildData);
    }
    return;
  };
  createDirectory(dirGuildData);
  return;
}

function getJsonFromFile(fileName, guild){
  let foundObj = false;
  // check if fileName exists
  const fileNameIsValid = ((filenm) => {
    let r = false;
    filesFromTemplate.forEach((value, key) => {
      if( key === filenm ){ r = true; }
    });
    return r;
  })(fileName);
  // return false if invalid fileName is provided
  if(fileNameIsValid){
    checkFilesExist(guild.id);
    const dir = pathToGuildData + guild.id + "/" + fileName;
    const fileData = fs.readFileSync(dir);
    foundObj = JSON.parse(fileData);
  }
  return foundObj;
}

module.exports.read = function(varName, fileName, guild) {
  let res = "";
  // conform fileName to '.json' extension
  fileName = fileName.split(".")[0] + ".json";
  const fileObj = getJsonFromFile(fileName, guild);
  // return empty string if invalid fileName is provided
  if(fileObj){
    const parts = varName.split(".");
    let obj = fileObj;
    for(let i = 0; i <= parts.length; i++){
      let part = parts.shift();
      obj = obj[part];
    }
    res = obj;
  }
  console.log("data.read called { \n varName: '"+varName+"' \n fileName: '"+fileName+"' \n guild.id: '"+guild.id+"' \n res: '"+ res+"' \n}"); // still testing all cases
  return res;
}

module.exports.write = function(varName, fileName, guild, newData) {
  let res = "";
  // conform fileName to '.json' extension
  fileName = fileName.split(".")[0] + ".json";
  const fileObj = getJsonFromFile(fileName, guild);
  // return with res as an empty string if invalid fileName is provided
  if(fileObj){
    // create the queue
    let russianDoll = [];
    const parts = varName.split(".");
    russianDoll.push(JSON.stringify(fileObj));
    let obj = fileObj;
    for(let i = 0; i <= parts.length; i++){
      let part = parts.shift();
      obj = obj[part];
      let keyValPairStr = '"' + part + '":' + JSON.stringify(obj);
      russianDoll[i] = russianDoll[i].split(keyValPairStr);
      russianDoll.push(keyValPairStr);
    }
    // now backtrack through the queue
    res = ((doll) => {
      let innerMost = doll.pop().split(":")[0] + ":" + newData;
      for(let i = doll.length-1; i >= 0; --i){
        doll[i] = doll[i][0]+innerMost+doll[i][1];
        innerMost = doll[i];
      }
      return innerMost;
    })(russianDoll);
    // write data
    const dir = pathToGuildData + guild.id + "/" + fileName;
    fs.writeFileSync(dir, res);
  }
  console.log("data.write called { \n varName: '"+varName+"' \n fileName: '"+fileName+"' \n guild.id: '"+guild.id+"' \n res: '"+ res+"' \n}"); // still testing all cases
  return;
}
