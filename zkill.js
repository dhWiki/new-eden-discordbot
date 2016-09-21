var request = require('request');
var utf8 = require('utf8');
var fs = require('fs');
var formidable = require("formidable");
var util = require("util");

var data = require('./data.js');
var config = require('./config');

var url = 'http://www.zkillboard.com/api/kills/no-attackers/no-items/corporationID/'+config.zkill_corp_id+'/limit/'
var limit = '20'
var options = {
  url: url + limit,
  headers: {
    'Accept-Encoding': 'gzip',
    'User-Agent': "David Heiberg/Echo Utrigas dhdavvie@gmail.com Discord Bot"
	}
};

var zkill_url = 'https://zkillboard.com/kill/'

module.exports.main = function(message){
	
	function callback(error, response, body){
		if(error) {
			console.log(error)
		}
		var new_kills_temp = [];
		var lastID = data.lastKillID
		if(response.statusCode == 200){
			var kills = JSON.parse(body);
			if (lastID == 0) {
				new_kills_temp.push(kills[0].killID);
				lastID = kills[0].killID;
			} else if (lastID) {
				//check if limit is big enough, otherwise double
				if (lastID < kills[kills.length-1].killID){
					limit = (parseInt(limit) * 2).toString();
					options.url = url + limit;
					request(options.url, callback);
				} else {
					for(var x = parseInt(limit)-1; x > -1; x--){
						if(lastID < kills[x].killID) {
							new_kills_temp.push(kills[x].killID);
							lastID = kills[x].killID;
						}

					}
				}
			}
		}
		data.setKillID(lastID)
		fs.writeFile("./data.json", JSON.stringify(data));
		printKills(new_kills_temp)
	}

	function printKills(kills) {
		console.log(kills)
		if (kills) {
			for (var x = 0; x < kills.length; x++) {
				message.channel.sendMessage(zkill_url + parseInt(kills[x]), function(err){if(err) throw err;}).then(message => console.log(`Sent message: ${message.content}`)).catch(console.log);
			}
		}
	}

	function getKills(){
		console.log("Fetching Zkillboard")
		var req = request(options.url, callback);
	}

	getKills()
};


