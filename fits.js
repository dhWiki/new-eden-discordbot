var config = require('./config');
var mysql = require('mysql');

var connection = mysql.createConnection(config.mysql);
connection.connect(function(err){
	if(err){
		console.log("Error connecting to database...");
	} else {
		console.log("Connected to database successfully");
	}
});
connection.query('CREATE TABLE IF NOT EXISTS '+config.mysql.table+' (`name` varchar(255) NOT NULL, `ship` varchar(255), `ship_class` varchar(255), `fit` text, `author` varchar(255), PRIMARY KEY(name))Engine=InnoDB, default charset=utf8',
	function(err){
		if(err) {
			console.log("Error creating table in database "+err);
		}
	});

exports.getFit = function(name, callback) {
	name = name.replace(/\'/g, "`");
	connection.query("SELECT * FROM `"+config.mysql.table+"` WHERE `name` = '"+name+"'", function(err, results, field){
		if(err) throw err;
		if(results) {
			callback(results[0].fit);
		} else {
			callback("Fit not found!");
		}
	});
}

exports.saveFit = function(message, callback) {
	var author = message.author.username;
	var content = message.content.replace(/ *<[^>]*> */, "").trim();
	content = content.replace(/\'/g, "`");
	var ship = content.match(/\[([^,]*),/)[1].trim();
	var name = content.match(/,([^\]]*)\]/)[1].trim();
	var query = "INSERT INTO "+config.mysql.table+" VALUES ('"+name+"', '"+ship+"', '  ', '"+content+"', '"+author+"')";
	connection.query(query, function(err) {
		if(err){
			callback("Failed to save fit!");
		} else {
			callback("Fit saved!");
		}
	});
}

