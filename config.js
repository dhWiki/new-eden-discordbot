var config = {};

config.discord = {};
config.youtube_api_key = 'YoutubeAPIKey';

config.discord.username = 'email@gmail.com';
config.discord.password = 'botpassword';

config.admins = ['Echo Utrigas'];
config.timer = 5; //Seconds

config.mysql = {};
config.mysql.user = "root";
config.mysql.password = "password";
config.mysql.host = "localhost";
config.mysql.database = "discord";
config.mysql.table = "discord_fits";


module.exports = config;
