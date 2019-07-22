const { bossTimerChanelId, lobbyBdoChanelId } = require("./config");
const { bossesString, now, nextBossesDayTime } = require("./bossTimer");
const getImperialRSString = require("./imperialCal");

let lobbyBdoChanel = null
let bossTimerChanel = null
let mess = null

function deleteIfExistAndSendNew(text) {
    if (mess) {
        mess.delete().then(() => {
            sendAndSave(text)
        });
    } else {
        sendAndSave(text)
    }
}

function editIfExistOrSendNew(text) {
    if (mess) {
        mess.edit(text);
    } else {
        sendAndSave(text)
    }
}

function sendAndSave(text) {
    bossTimerChanel.send(text)
    .then(msg => {
        mess = msg;
    });
}

function sendMessToBossTimerIfNeeded(time, text) {
    const { timeInHours, minutes } = time;
    if (timeInHours === 1) {
        if (minutes === 0) {
            deleteIfExistAndSendNew(text);
        } else {
            editIfExistOrSendNew(text);
        }
    } else if (timeInHours === 0) {
        switch (minutes) {
            case 30:                 
            case 25:
            case 20:
            case 15:
            case 10:
            case 5:
                deleteIfExistAndSendNew(text);
                break;
            default:
                editIfExistOrSendNew(text);
                break;
        }
    } else {
        editIfExistOrSendNew(text);
    }
}

function getBossTimeTopicText() {
    const nowTime = now();
    const bossTime = nextBossesDayTime(nowTime);
    let timeInHours = bossTime.time.value - nowTime.timeValue + (bossTime.dayOffset > 0 ? 24 : 0);
    let minutes = timeInHours % 1;
    timeInHours = Math.round(timeInHours - minutes);
    minutes = Math.round(minutes * 60 - 1);
    const hourString = timeInHours > 0 ? ` **${timeInHours}** giờ` : "";
    const minString = minutes > 0 ? ` **${minutes}** phút` : "";

    const text = `${bossesString(bossTime.bosses)} sẽ xuất hiện sau${(hourString)}${minString}`;
    sendMessToBossTimerIfNeeded({ timeInHours, minutes }, text);

    return text + `. ${getImperialRSString()}`;
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