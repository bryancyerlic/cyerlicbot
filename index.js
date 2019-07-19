// require the discord.js module
const Discord = require("discord.js");

// create a new Discord client
const client = new Discord.Client();
const startRunLoop = require("./runLoop");

const {
  nextBossRegexs,
  bossAtRegexs,
  todayBossesRegexs,
  nextdayBossesRegexs,
  checkInChanelId,
  bossTimerChanelId,
  botChanelId
} = require("./config");

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("ready");
  startRunLoop(client);
});

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

function bossTimerRep(message, text, duration) {
  if (message.channel.id === botChanelId) {
    message.reply(text)
    .then(msg => {
      setTimeout(() => {
        msg.edit(text);
      }, 5000);
    })
  } else {
    repTempo(message, text, duration);
  }
}

client.on("message", message => {
  const text = message.content.toLowerCase();
  const args = text.split(" ");
  const command = args.shift().toLowerCase();

  if (message.channel.id === checkInChanelId && !message.author.bot) {
    repTempo(
      message,
      "Đây là chanel dùng để điểm danh, nếu đây không phải tin nhắn điểm danh, hãy xóa tin nhắn đi nhé :D",
      5
    );
    return;
  }

  if (match(command, nextBossRegexs)) {
    message.delete(3000);
    bossTimerRep(message, bossTimer.whichNext(), 15);
  } else if (match(text, bossAtRegexs)) {
    message.delete(3000);
    bossTimerRep(
      message,
      bossTimer.whichAt(args[0].replace("?", "")),
      15
    );
  } else if (match(command, todayBossesRegexs)) {
    message.delete(3000);
    bossTimerRep(message, bossTimer.todayBosses(), 60);
  } else if (match(command, nextdayBossesRegexs)) {
    message.delete(3000);
    bossTimerRep(message, bossTimer.nextdayBosses(), 60);
  }
});

client.login(process.env.BOT_TOKEN);
