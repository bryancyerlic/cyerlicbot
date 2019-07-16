const { bossTimerChanelId } = require("./config");
const { now, nextBossesDayTime } = require("./bossTimer");

let bossTimerChanel = null;

function bossesStringForSuffix(bosses) {
    let result = `${bosses[0]}`;
    if (bosses.length === 1) {
        return result;
    }
    for (let i = 1; i < bosses.length; i++) {
        result += `|${bosses[i]}`;
    }
    return result;
}

function getBossTimerSuffix() {
    const nowTime = now();
    const bossTime = nextBossesDayTime(nowTime);
    let timeInHours = bossTime.time.value - nowTime.timeValue + (bossTime.dayOffset > 0 ? 24 : 0);
    let minutes = timeInHours % 1;
    timeInHours = timeInHours - minutes;
    minutes = minutes * 60;
    const hourString = timeInHours > 0 ? `${Math.round(timeInHours)}h` : "";
    const minString = minutes > 0 ? `${Math.round(minutes)}m` : "";
    return `${bossesStringForSuffix(bossTime.bosses)} in ${(hourString)}${minString}`;
}

function loop() {
    bossTimerChanel.setName(`${getBossTimerSuffix()}`);
}

module.exports = function startRunLoop(client) {
    bossTimerChanel =  client.channels.get(bossTimerChanelId);
    loop();
    setInterval(loop, 60000);
}