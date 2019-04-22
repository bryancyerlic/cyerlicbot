const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {  
/**
 * 001 Ping Pong
 */
 
	if (message.content === '!ping') {
	// Send "pong" to the same channel
	message.channel.send('pong');
	}
	
/**
 * 002 Avatar
 */
 
	if (message.content === '!avatar') {
    message.reply(message.author.avatarURL);
	
	
/********/	
});
client.login(process.env.BOT_TOKEN);
