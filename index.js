// require the discord.js module
const Discord = require("discord.js");

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {});

const nextBossRegexs = [/^boss\?$/, /^next\?$/];
const bossAtRegexs = [/^at .*\?$/];
const todayBossesRegexs = [/^today\?$/];
const nextdayBossesRegexs = [/^mai\?$/, /^tomorrow\?$/, /^nextday\?/];
const checkInChancelId = "598426642976604170";

function match(command, regexs) {
  return regexs.find(regex => regex.test(command));
}

const bossTimer = require("./bossTimer");

function tempoTextWithDuration(duration) {
    return `\nTin nhắn này sẽ tự động **xóa** sau **${duration}s**`;
  }
  
  function timeoutMessage(msg, text, duration) {
    setTimeout(() => {
      if (duration > 5) {
        duration -= 5;
        msg.edit(text + tempoTextWithDuration(duration));
        timeoutMessage(msg, text, duration);
      } else {
        msg.delete();
      }
    }, 5000);
  }
  
  function repTempo(message, text, duration) {
    // const notiText = `\n\`\`\`css
    // Tự động xóa sau ${duration / 1000}s\`\`\``;
    message.reply(text + tempoTextWithDuration(duration)).then(msg => {
      timeoutMessage(msg, text, duration);
    });
    return;
  }

client.on("message", message => {
  const text = message.content.toLowerCase();
  const args = text.split(" ");
  const command = args.shift().toLowerCase();

  if (message.channel.id === checkInChancelId && !message.author.bot) {
    repTempo(
      message,
      "Đây là chanel dùng để điểm danh, nếu đây không phải tin nhắn điểm danh, hãy xóa tin nhắn đi nhé :D",
      5
    );
    return;
  }

  if (match(command, nextBossRegexs)) {
    repTempo(message, bossTimer.whichNext(), 10);
  } else if (match(text, bossAtRegexs)) {
    repTempo(
      message,
      bossTimer.bossTimer.whichAt(args[0].replace("?", "")),
      10
    );
  } else if (match(command, todayBossesRegexs)) {
    repTempo(message, bossTimer.todayBosses(), 30);
  } else if (match(command, nextdayBossesRegexs)) {
    repTempo(message, bossTimer.nextdayBosses(), 30);
  }
});

client.login(process.env.BOT_TOKEN);
