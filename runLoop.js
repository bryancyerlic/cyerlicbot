const { bossTimerChanelId, lobbyBdoChanelId } = require("./config");
const { bossesString, now, nextBossesDayTime } = require("./bossTimer");

let lobbyBdoChanel = null
let bossTimerChanel = null
let mess = null

function sendMessToBossTimerIfNeeded(time, text) {
    const { timeInHours, minutes } = time;
    const c60 = timeInHours === 1 && minutes === 0;
    const c30 = timeInHours === 0 && minutes === 30;
    const c15 = timeInHours === 0 && minutes === 15;
    const c10 = timeInHours === 0 && minutes === 10;
    const c5 = timeInHours === 0 && minutes === 5;
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
                mess.delete().then(() => {
                    bossTimerChanel.send(text)
                    .then(msg => {
                        mess = msg;
                    });
                });
                    break;
                default:
                mess.edit(text);
                    break;
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
    sendMessToBossTimerIfNeeded(time, text)

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