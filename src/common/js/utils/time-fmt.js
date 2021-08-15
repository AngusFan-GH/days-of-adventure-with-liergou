const $moment = require("moment");

$moment.locale("zh_CN");

export function timeRangeFmt(startTime, endTime, isFull = false, isOrder = false) {
    if (startTime == null && endTime == null) return null;
    const isMissed = $moment(endTime).isBefore();
    if (!isOrder && isMissed) {
        return "已结束";
    }
    const isBegin = $moment(startTime).isBefore();
    if (!isOrder && isBegin) {
        return "已开始";
    }
    const startTimeStr = $moment(startTime).calendar(
        null,
        !isFull
            ? {
                sameDay: "[今日] HH:mm",
                nextDay: "[明日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "MM月DD日 HH:mm",
                lastWeek: "MM月DD日 HH:mm",
                sameElse: "MM月DD日 HH:mm",
            }
            : {
                sameDay: "YYYY-MM-DD([今日]) HH:mm",
                nextDay: "YYYY-MM-DD([明日]) HH:mm",
                lastDay: "YYYY-MM-DD([昨日]) HH:mm",
                nextWeek: "YYYY-MM-DD(dddd) HH:mm",
                lastWeek: "YYYY-MM-DD(dddd) HH:mm",
                sameElse: "YYYY-MM-DD(dddd) HH:mm",
            }
    );
    const endTimeStr = $moment(endTime).calendar(
        startTime,
        !isFull
            ? {
                sameDay: "HH:mm",
                nextDay: "[次日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "MM月DD日 HH:mm",
                lastWeek: "MM月DD日 HH:mm",
                sameElse: "MM月DD日 HH:mm",
            }
            : {
                sameDay: "HH:mm",
                nextDay: "[次日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "YYYY-MM-DD(dddd) HH:mm",
                lastWeek: "YYYY-MM-DD(dddd) HH:mm",
                sameElse: "YYYY-MM-DD(dddd) HH:mm",
            }
    );
    return `${startTimeStr}${isFull ? "~" : "-"}${endTimeStr}`;
}

export function dateSlideSelectionDataMaker(startDate = Date.now(), length = 15) {
    $moment.locale('zh-CN', {
        weekdays: [
            "周日", "周一", "周二", "周三", "周四", "周五", "周六"
        ]
    });
    return new Array(length).fill(null).map((_, index) => {
        const date = $moment(startDate).add(index, "days");
        const [week, day] = date.calendar($moment(startDate), {
            sameDay: "[今天] MM-DD",
            nextDay: "dddd MM-DD",
            nextWeek: "dddd MM-DD",
            lastDay: "dddd MM-DD",
            lastWeek: "dddd MM-DD",
            sameElse: "dddd MM-DD",
        }).split(' ');
        return {
            week,
            day,
            date: date.format('YYYY-MM-DD')
        };
    });
}

export function isToday(date) {
    return $moment(date).isSame(Date.now(), 'days');
}

export function timeFmt(date, fmtStr) {
    date = date || Date.now();
    return $moment(date).format(fmtStr);
}

export function dateStr2timestamp(dateStr) {
    return new Date(dateStr.replace(/-/g, '/')).getTime();
}

export function defaultStartTimeMaker(date) {
    let time = date ? isToday(date) ? Date.now() : date : Date.now();
    const timeArr = $moment(time).toArray();
    timeArr.length = 5;
    const hour = timeArr[3];
    const seconds = timeArr.pop();
    if (seconds === 0) {
        return new Date(...timeArr);
    }
    if (seconds > 30) {
        if (hour === 23) {
            timeArr.push(59);
        } else {
            timeArr[3] += 1;
            timeArr.push(0);
        }
    } else {
        timeArr.push(30);
    }
    return new Date(...timeArr).getTime();
}
