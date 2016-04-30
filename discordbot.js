var Discord = require('discord.js');
var feed = require("feed-read");
var moment = require('moment');
var config = require('./config');

var YouTube = require('youtube-node');
var youtube = new YouTube();
youtube.setKey(config.youtube_api_key);
youtube.addParam('channelId', 'UCwF3VyalTHzL0L-GDlwtbRw'); //Eve online channel
youtube.addParam('order', 'date'); //sort by date



var lastDevBlog = {
	title : ""
};
var lastPatchNotes = {
	title : ""
};
var lastEveNews = {
	title : ""
};
var lastYtLink = "";

var seconds = config.timer;
var timer = seconds * 1000;
var bot = new Discord.Client();
var channel;
var botOn = false;
console.log( getTime() + " - Starting Discord Bot");

bot.login(config.discord.username, config.discord.password);

function getTime() {
	var time = "["+moment().format('D/M/YY - h:mm:ss a')+"]";
	return time;
}

function checkUser(username) {
	//Could be done using indexOf() but this allows for better error reporting I think
	for (var i = 0; i < config.admins.length; i++){
		if (username === config.admins[i]) return 1; //User is allowed to turn bot on
	}
	console.log(getTime() + " - Unauthorized use of Bot by:" + username);
	return 0 //User is not an admin and therefor can't turn it on
}

bot.on("message", function(message){
	if(message.content === "!BotOn" && !botOn && checkUser(message.author.username) ) {
		botOn = true;
		
		console.log(getTime() + " - Bot being turned ON");

		bot.sendMessage(message.channel, "Bot turning ON!", function(err) {if(err) throw err;});

		setInterval(function(){ 
			feed("https://newsfeed.eveonline.com/en-US/2/articles/page/1/20", function(err, devblogs){
				if(err) throw err;
				if(!(devblogs[0].title === lastDevBlog.title)) {
					lastDevBlog = devblogs[0]; //set new last article
					console.log(getTime() + " - New dev blog: "+lastDevBlog.link);
					bot.sendMessage(message.channel, lastDevBlog.link, function(err){
						if(err) console.log(getTime() + " - error : "+channel.id+" " + err);
					});
				}
			});
			feed("https://newsfeed.eveonline.com/en-US/44/articles/page/1/20", function(err, evenews){
				if(err) throw err;
				if(!(evenews[0].title === lastEveNews.title)) {
					lastEveNews = evenews[0]; //set new last article
					console.log(getTime() + " - New Eve news: "+lastEveNews.link);
					bot.sendMessage(message.channel, lastEveNews.link, function(err){
						if(err) console.log(getTime() + " - error : "+channel.id+" " + err);
					});
				}
			});
			feed("https://newsfeed.eveonline.com/en-US/15/articles/page/1/5", function(err, patchnotes){
				if(err) throw err;
				if(!(patchnotes[0].title === lastPatchNotes.title)) {
					lastPatchNotes = patchnotes[0]; //set new last article
					console.log(getTime() + " - New patch notes: "+lastPatchNotes.link);
					bot.sendMessage(message.channel, lastPatchNotes.link, function(err){
						if(err) console.log(getTime() + " - error : "+channel.id+" " + err);
					});
				}
			});
			youtube.search('', 1, function(err, results) {
				if (err) {
					console.log(err);
				} else {
					var ytLink = "https://www.youtube.com/watch?v="+results.items[0].id.videoId;
					if(!(ytLink === lastYtLink)) {
						lastYtLink = ytLink;
						console.log(getTime() + " - New Youtube Video: "+ytLink);
						bot.sendMessage(message.channel, ytLink, function(err) {
							if(err) console.log(getTime() + " - error: " +channel.id+" "+err);
						});
					}
				}
			});
		}, timer);
	}
	if(message.content === "!BotOff" && botOn && checkUser(message.author.username)) {
		botOn = false;
		console.log(getTime() + " - Bot being turned OFF");
		bot.sendMessage(message.channel, "Bot turning OFF!", function(err){if(err) throw err;});
	}

	
});
