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

function match(command, regexs) {
    return regexs.find(regex => regex.test(command));
}

const bossTimer = require('./bossTimer');

client.on('message', message => {
    const text = message.content;
    const args = text.split(' ');
    const command = args.shift().toLowerCase();

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

client.login('NTY5NzYzMDg3ODk3NDYwNzY3.XL1XwA.kuvVCC2nTsavZhoqvgO9OUybd0g');

const souAuto = new Discord.Client();
souAuto.login('NDIxMzU0NDEzMTgxODk0Njk1.XSmYCA.tldp6MqTZ2QRTghNlsxQ-jRO6os');
souAuto.on('message', message => {
    const text = message.content;
    const args = text.split(' ');
    const command = args.shift().toLowerCase();

    if (match(command, nextBossRegexs)) {
        message.reply(bossTimer.whichNext());
    } else if (match(text, bossAtRegexs)) {
        const res = bossTimer.whichAt(args[0].replace('?', ""))
        if (res) { message.reply(res); }
    } else if (match(command, todayBossesRegexs)) {
        message.reply(bossTimer.todayBosses());
    } else if (match(command, nextdayBossesRegexs)) {
        message.reply(bossTimer.nextdayBosses());
    }
});
