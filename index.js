// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
});

const nextBossRegexs = [ /^boss\?$/, /^next\?$/ ];
const bossAtRegexs = [ /^at .*\?$/ ];
const todayBossesRegexs = [ /^today\?$/ ];
const nextdayBossesRegexs = [ /^mai\?$/, /^tomorrow\?$/, /^nextday\?/ ];
const checkInChancelId = "598426642976604170";

function match(command, regexs) {
    return regexs.find(regex => regex.test(command));
}

const bossTimer = require('./bossTimer');

client.on('message', message => {
    const text = message.content;
    const args = text.split(' ');
    const command = args.shift().toLowerCase();

    if (message.channel.id === checkInChancelId && !message.author.bot) {
        message.reply("**Tự động xóa sau 5s**\nĐây là chanel dùng để điểm danh, nếu đây không phải tin nhắn điểm danh, hãy xóa tin nhắn đi nhé :D")
        .then(msg => {
          msg.delete(5000)
        })
        return;
    }

    if (match(command, nextBossRegexs)) {
        message.reply(bossTimer.whichNext());
    } else if (match(text, bossAtRegexs)) {
        message.reply(bossTimer.whichAt(args[0].replace('?', "")));
    } else if (match(command, todayBossesRegexs)) {
        message.reply(bossTimer.todayBosses());
    } else if (match(command, nextdayBossesRegexs)) {
        message.reply(bossTimer.nextdayBosses());
    }
});

client.login(process.env.BOT_TOKEN);
