var request = require('request');
var utf8 = require('utf8');
var config = require('./config');
var fs = require('fs');
var formidable = require("formidable");
var util = require("util");

var url = 'http://www.zkillboard.com/api/kills/no-attackers/no-items/corporationID/'+config.zkill_corp_id+'/limit/'
var limit = '20'
var options = {
  url: url + limit,
  headers: {
    'Accept-Encoding': 'gzip',
    'User-Agent': "David Heiberg/Echo Utrigas dhdavvie@gmail.com Discord Bot"
	}
};


function callback(error, response, body){
	if(error) {
		console.log(error)
	}
	var lastID = config.zkill_lastkill
	var new_kills = []
	if(response.statusCode == 200){
		var kills = JSON.parse(body);
		if (lastID) {
			//check if limit is big enough, otherwise double
			if (lastID < kills[kills.length-1].killID){
				limit = (parseInt(limit) * 2).toString();
				options.url = url + limit;
				return request(options.url, callback);
			} else {
				for(var x = parseInt(limit)-1; x > -1; x--){
					if(lastID < kills[x].killID) {
						new_kills.push(kills[x].killID);
						lastID = kills[x].killID;
					}

				}
			}
		}
	}
	//console.log(new_kills)
	config.zkill_lastkill = lastID
	return new_kills
}



function getKills(){
	var req = request(options.url, callback);
	return req;
}

console.log(getKills())

