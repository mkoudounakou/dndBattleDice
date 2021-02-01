// DEPENDENCIES



// HELPER FUNCTIONS

module.exports.timeStamp = function(date) {
	var str = date.toISOString();
	var i = str.indexOf("T");
	var d = str.substring(0,i).split("-");
	var t = str.substring(i+1,str.length-1);
	return `date: ${d[2]}/${d[1]}/${d[0]} | time: ${t} |`;
}

module.exports.isYesNoOther = function(input) {
  const validInputs = {
    // my collection of sayings and languages, includes: english, french, greek, german, italian, irish, scottish gaelic, welsh, japanese, chinese, russian
    yay: ["true", "t", "on", "1", "y", "yes", "yay", "yah", "oui", "nai", "ja", "si", "sea", "tha", "ie", "hai", "shi", "da", "yeah", "yea", "aye", "yass", "gucci"],
    nay: ["false", "f", "off", "0", "n", "no", "nay", "nah", "non", "ochi", "nein", "nil", "chaneil", "na", "bango", "meiyou", "nyet", "bangbang", "yeet", "nottodaysatan", "nawh", "ohhellno", "begonefoulthot"],
  };
  return ( i => {if(validInputs.yay.includes(i)) return 1; else if(validInputs.nay.includes(i)) return 2; else return 3;})(input.toLowerCase());
}
