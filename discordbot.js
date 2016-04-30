var Discord = require('discord.js');
var feed = require("feed-read");
var moment = require('moment');



var lastDevBlog = {
	title : ""
};
var lastPatchNotes = {
	title : ""
};
var lastEveNews = {
	title : ""
};
var seconds = 300; //timer
var timer = seconds * 1000;
var bot = new Discord.Client();
var channel;
var botOn = false;
console.log( getTime() + " - Starting Discord Bot");

bot.login("botEmail", "botpassword");

function getTime() {
	var time = "["+moment().format('D/M/YY - h:mm:ss a')+"]";
	return time;
}

bot.on("message", function(message){
	if(message.content === "!BotOn" && !botOn && message.author.username === "Echo Utrigas") {
		botOn = true;
		
		console.log(getTime() + " - Bot being turned ON");
		bot.sendMessage(channel, "Dev Blog/Patch Notes RSS Feed ON!", function(err) {if(err) throw err;});
		setInterval(function(){ 
			feed("https://newsfeed.eveonline.com/en-US/2/articles/page/1/20", function(err, devblogs){
				if(err) throw err;
				if(!(devblogs[0].title === lastDevBlog.title)) {
					lastDevBlog = devblogs[0]; //set new last article
					console.log(getTime() + " - New dev blog: "+lastDevBlog.link);
					bot.sendMessage(message.channel, lastDevBlog.link, function(err){
						if(err) console.log("error : "+channel.id+" " + err);
					});
				}
			});
			feed("https://newsfeed.eveonline.com/en-US/44/articles/page/1/20", function(err, evenews){
				if(err) throw err;
				if(!(evenews[0].title === lastEveNews.title)) {
					lastEveNews = evenews[0]; //set new last article
					console.log(getTime() + " - New Eve news: "+lastEveNews.link);
					bot.sendMessage(message.channel, lastEveNews.link, function(err){
						if(err) console.log("error : "+channel.id+" " + err);
					});
				}
			});
			feed("https://newsfeed.eveonline.com/en-US/15/articles/page/1/5", function(err, patchnotes){
				if(err) throw err;
				if(!(patchnotes[0].title === lastPatchNotes.title)) {
					lastPatchNotes = patchnotes[0]; //set new last article
					console.log(getTime() + " - New patch notes: "+lastPatchNotes.link);
					bot.sendMessage(message.channel, lastPatchNotes.link, function(err){
						if(err) console.log("error : "+channel.id+" " + err);
					});
				}
			});
		}, timer);
	}
	if(message.content === "!BotOff" && botOn && message.author.username === "Echo Utrigas") {
		botOn = false;
		console.log(getTime() + " - Bot being turned OFF");
		bot.sendMessage(channel, "Bot turning off!", function(err){if(err) throw err;});
	}

	
});
