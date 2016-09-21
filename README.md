# new-eden-discordbot v0.1.1

## Installing Bot

Download the bot  
> `git clone https://github.com/dhdavvie/new-eden-discordbot.git`

Install node packages  
> `npm install`

Install mysql
> `sudo apt-get install mysql-server`

Create database for discord in MySQL
> `CREATE DATABASE <db-name>;`

##Configure

Rename `config.js.dist` to `config.js`. Configure the `config.js` file. [Tutorial for Youtube API key ](https://www.youtube.com/watch?v=Im69kzhpR3I). Set the admins (people who can turn bot on and off with `!BotOn` and `!BotOff`), change the timer if you want it to check more or less regularly. Set the parameters of you MySQL service, if you wish to use the fitting service that is.

Create a [Bot User](https://discordapp.com/developers/applications/me#top) and add him to your server using `https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot`. Replace `CLIENT_ID` with the bot Client Id. Place the Token in the config file.


Run the bot! Note: Need node v6+
> `node discordbot.js`

### Todo
- Ops Scheduler
