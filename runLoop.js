const { bossTimerChanelId, lobbyBdoChanelId } = require("./config");
const { bossesString, now, nextBossesDayTime } = require("./bossTimer");

let lobbyBdoChanel = null
let bossTimerChanel = null
let mess = null

function sendAndSave(text) {
    bossTimerChanel.send(text)
    .then(msg => {
        mess = msg;
    });
}

function sendMessToBossTimerIfNeeded(time, text) {
    const { timeInHours, minutes } = time;
    if (timeInHours === 1) {
        bossTimerChanel.send(text)
        .then(msg => {
            mess = msg;
        })
    } else if (timeInHours === 0) {
            switch (minutes) {
                case 30:                 
                case 15:
                case 10:
                case 5:
                if (mess) {
                    mess.delete().then(() => {
                        sendAndSave(text)
                    });
                } else {
                    sendAndSave(text)
                }

                    break;
                default:
                if (mess) {
                    mess.edit(text);
                } else {
                    sendAndSave(text)
                }
                    break;
            }
    } else {
        if (mess) {
            mess.edit(text);
        } else {
            sendAndSave(text)
        }
    }
}

function getBossTimeTopicText() {
    const nowTime = now();
    const bossTime = nextBossesDayTime(nowTime);
    let timeInHours = bossTime.time.value - nowTime.timeValue + (bossTime.dayOffset > 0 ? 24 : 0);
    let minutes = timeInHours % 1;
    timeInHours = timeInHours - minutes;
    minutes = minutes * 60 - 1;
    const hourString = timeInHours > 0 ? ` **${Math.round(timeInHours)}** giờ` : "";
    const minString = minutes > 0 ? ` **${Math.round(minutes)}** phút` : "";

    const text = `${bossesString(bossTime.bosses)} sẽ xuất hiện sau${(hourString)}${minString}`;
    sendMessToBossTimerIfNeeded({ timeInHours, minutes }, text);

    return text;
}

function loop() {
    const bossTimeTopicText = getBossTimeTopicText();
    lobbyBdoChanel.setTopic(bossTimeTopicText);
    bossTimerChanel.setTopic(bossTimeTopicText);
}

module.exports = function startRunLoop(client) {
    lobbyBdoChanel =  client.channels.get(lobbyBdoChanelId);
    bossTimerChanel = client.channels.get(bossTimerChanelId);
    loop();
    setInterval(loop, 60000);
}