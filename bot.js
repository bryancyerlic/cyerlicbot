const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

client.on('message', message => {  
/**
 * 001 Ping Pong
 */ 
	if (message.content === '!ping') {
		message.channel.send('pong');
	}	
/**
 * 002 Avatar
 */
	if (message.content === '!avatar') {
		message.reply(message.author.avatarURL);
	}	
/********/	
});
client.login(process.env.BOT_TOKEN);
