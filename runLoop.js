const { bossTimerChanelId, lobbyBdoChanelId } = require("./config");
const { bossesString, now, nextBossesDayTime } = require("./bossTimer");

let lobbyBdoChanel = null
let bossTimerChanel = null

function getBossTimeTopicText() {
    const nowTime = now();
    const bossTime = nextBossesDayTime(nowTime);
    let timeInHours = bossTime.time.value - nowTime.timeValue + (bossTime.dayOffset > 0 ? 24 : 0);
    let minutes = timeInHours % 1;
    timeInHours = timeInHours - minutes;
    minutes = minutes * 60 - 1;
    const hourString = timeInHours > 0 ? ` **${Math.round(timeInHours)}** giờ` : "";
    const minString = minutes > 0 ? ` **${Math.round(minutes)}** phút` : "";
    return `${bossesString(bossTime.bosses)} sẽ xuất hiện sau${(hourString)}${minString}`;
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