const {
    now
} = require("./bossTimer");

function stringOfRemainTime(timeInHours) {
    let minutes = timeInHours % 1;
    timeInHours = Math.round(timeInHours - minutes);
    minutes = Math.round(minutes * 60 - 1);
    const hourString = timeInHours > 0 ? ` **${timeInHours}** giờ` : "";
    const minString = minutes > 0 ? ` **${minutes}** phút` : "";
    return `${(hourString)}${minString}`;
}

const imperialRSTimes = [ 1, 4, 7, 10, 13, 16, 19, 22 ];
const imperialTradRSTimes = [ 3, 7, 11, 15, 19, 23 ];

function remainTime({ from: now, marks: times }) {
    let nextTime = times.find(time => time > now);
    if (!nextTime) {
        nextTime = times[0] + 24
    }
    return nextTime - now;
}

module.exports = function getImperialRSTimesString() {
    const { timeValue } = now();
    const tilImperialRS = remainTime({from: timeValue, marks: imperialRSTimes});
    const tilImperialTradRS = remainTime({from: timeValue, marks: imperialTradRSTimes});
    const impRSStr = stringOfRemainTime(tilImperialRS);
    const impTraRSStr = stringOfRemainTime(tilImperialTradRS);
    return `**Imperial** sẽ reset sau ${impRSStr}. **Imperial Trade** sẽ reset sau ${impTraRSStr}`;
};