
const nouver = "Nouver",
kutum = "Kutum",
garmoth = "Garmoth",
offin = "Offin",
vell = "Vell",
muraka = "Muraka",
karanda = "Karanda",
quint = "Quint",
kzarka = "Kzarka";

const bossDays = [
    { name: "Chủ nhật", 	t0h30: [karanda], 	t6: [kutum], 	t10: [kzarka, karanda], t14: [nouver, kutum], 	t15: [vell], 			t19: [karanda], 		t23: [nouver, kutum] },
    { name: "Thứ 2", 		t0h30: [kzarka], 	t6: [garmoth], 							t14: [nouver], 			t15: [karanda],			t19: [kzarka], 			t23: [offin] },
    { name: "Thứ 3", 		t0h30: [nouver], 	t6: [kutum], 	t10: [kzarka],          t14: [kutum], 	        t15: [nouver],			t19: [muraka, quint], 	t23: [nouver, kutum] },
    { name: "Thứ 4", 		t0h30: [kzarka], 					t10: [kzarka], 			t14: [karanda], 								t19: [kutum], 			t23: [offin] },
    { name: "Thứ 5", 		t0h30: [kutum], 	t6: [nouver], 	t10: [kzarka], 			t14: [kutum], 			t15: [kzarka, karanda],	t19: [kzarka, karanda], t23: [nouver, kzarka] },
    { name: "Thứ 6", 		t0h30: [kzarka], 	t6: [karanda],	t10: [kutum], 			t14: [kzarka], 									t19: [nouver], 			t23: [offin] },
    { name: "Thứ 7", 		t0h30: [karanda], 	t6: [nouver], 	t10: [kzarka, kutum], 	t14: [nouver, karanda], t15: [garmoth],			t19: [muraka, quint] }
];

const times = [
    {
        value: 0.5, name: "t0h30", displayText: "00:30",
        texts: [ "0", "0.5", "0h30", "0:30", "00:30" ]
    },
    {
        value: 6, name: "t6", displayText: "06:00",
        texts: [ "6", "6h", "6h00", "6:00", "06:00" ]
    },
    {
        value: 10, name: "t10", displayText: "10:00",
        texts: [ "10", "10h", "10h00", "10:00" ]
    },
    {
        value: 14, name: "t14", displayText: "14:00",
        texts: [ "2", "2pm", "14", "14h", "14h00", "14:00" ]
    },
    {
        value: 15, name: "t15", displayText: "15:00",
        texts: [ "3", "3pm", "15", "15h", "15h00", "15:00" ]
    },
    {
        value: 19, name: "t19", displayText: "19:00",
        texts: [ "7", "7pm", "19", "19h", "19h00", "19:00" ]
    },
    {
        value: 23, name: "t23", displayText: "23:00",
        texts: [ "11", "11pm", "23", "23h", "23h00", "23:00" ]
    },
];

// New helpers
function now() {
    let _now = new Date();
    const hoursOffset = 7 + _now.getTimezoneOffset() / 60;
    _now.setHours(_now.getHours() + hoursOffset);
    return {
    day: _now.getDay(),
    timeValue: timeValue(_now)
    };
}

function timeValue(time) {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const _timeValue = hour + (minute / 60);
    return _timeValue;
}

function timeByValue(timeValue) {
    return times.find(time => time.value === timeValue) || null;
}

function timeByName(timeName) {
    return times.find(time => time.name === timeName) || null;
}

function nextBossesDayTime(now, findingBoss = null) {
    let { day, timeValue } = now;
    let dayOffset = 0;

    let bosses = bossesAt(day, timeValue);
    while(!bosses || (findingBoss && !bosses.includes(findingBoss)) ) {
        let nextDayTime = nextValidDayTime({ day, timeValue });
        if (nextDayTime.day != day) {
            dayOffset += 1;
        }
        day = nextDayTime.day;
        timeValue = nextDayTime.timeValue;
        bosses = bossesAt(day, timeValue);
    }

    return {
    day,
    time: timeByValue(timeValue),
    dayOffset,
    bosses,
    };
}

function bossesAt(day, timeValue) {
    const time = timeByValue(timeValue);
    if (time) {
        return bossDays[day][time.name];
    }
    return null;
}

function nextValidDayTime({ day, timeValue }) {
    let resultTimeValue = null;
    let resultDay = day;
    for (let i = 0; i < times.length; i++) {
    if (times[i].value > timeValue) {
        resultTimeValue = times[i].value;
        break;
    }
    }
    if (!resultTimeValue) {
        resultTimeValue = times[0].value;
        resultDay = nextDayOf(resultDay);
    }

    return {
        day: resultDay,
        timeValue: resultTimeValue
    };
}

function nextDayOf(day) {
    if (day > 5) {
    return 0;
    }
    return day + 1;
}

function bossesString(bosses) {
    let result = `**${bosses[0]}**`;
    if (bosses.length === 1) {
        return result;
    }
    for (let i = 1; i < bosses.length; i++) {
        result += ` và **${bosses[i]}**`;
    }
    return result;
}

function dayBossesString(day, dayDisplayText = "hôm nay") {
    let resultString = `Danh sách boss xuất hiện **${dayDisplayText}**:`;
    const { day: today, timeValue: nowTimeValue } = now();
    times.forEach(time => {
        const bosses = bossesAt(day, time.value);
        if (!bosses) { return; }
        if (nowTimeValue > time.value && day === today) {
            resultString += `\n\t\t~~${bossesString(bosses)} đã xuất hiện lúc **${time.displayText}**~~`;
        } else {
            resultString += `\n\t\t${bossesString(bosses)} sẽ xuất hiện lúc **${time.displayText}**`;
        }
    });
    return resultString;
}

function guessTimeMark(text) {
    let result = null;
    for (let i = 0; i < times.length; i++) {
        const time = times[i].texts.find(timeText => timeText === text);
        if (time) {
            result = times[i];
            break;
        }
    }
    return result;
}
// End new helpers


function whichNext() {
    const {
    bosses,
    day,
    time,
    dayOffset
    } = nextBossesDayTime(now());
    let responseText = `Boss tiếp theo là ${bossesString(bosses)} vào lúc **${time.displayText}**`;
    const dayTexts = ["hôm nay", "ngày mai", "ngày kia"];
    if (dayOffset < 3) { responseText += `, **${dayTexts[dayOffset]}**.`; } else {
        responseText += `, **${bossDays[day].displayText}**.`;
    }
    return responseText;
}

function whichAt(timeText) {
    const time = guessTimeMark(timeText);
    if (!time) { return; }
    const { day, timeValue: nowTimeValue } = now();
    let bosses = null;
    let dayString = "";
    if (nowTimeValue > time.value) {
        bosses = bossesAt(nextDayOf(day), time.value);
        dayString = "ngày mai";
    } else {
        bosses = bossesAt(day, time.value);
        dayString = "hôm nay";
    }

    if (bosses) { return `**${time.displayText} ${dayString}** sẽ xuất hiện ${bossesString(bosses)}`; }
    else { return `**${time.displayText} ${dayString}** sẽ không xuất hiện boss`; }
}

function todayBosses() {
    const { day } = now();
    let responseText = dayBossesString(day);
    return responseText;
}

function nextdayBosses() {
    let { day } = now();
    day = nextDayOf(day);
    let responseText = dayBossesString(day, "ngày mai");
    return responseText;
}

module.exports = {
    whichAt,
    whichNext,
    todayBosses,
    nextdayBosses
}