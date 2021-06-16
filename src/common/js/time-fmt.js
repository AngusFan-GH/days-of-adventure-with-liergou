const $moment = require("moment");

$moment.locale("zh_CN");

export function timeRangeFmt(startTime, endTime, isFull = false) {
    if (startTime == null && endTime == null) return null;
    const isMissed = $moment(endTime).isBefore();
    if (isMissed) {
        return "已结束";
    }
    const isBegin = $moment(startTime).isBefore();
    if (isBegin) {
        return "已开始";
    }
    const startTimeStr = $moment(startTime).calendar(
        null,
        !isFull
            ? {
                sameDay: "[今日] HH:mm",
                nextDay: "[明日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "MM月DD日 hh:mm",
                lastWeek: "MM月DD日 hh:mm",
                sameElse: "MM月DD日 hh:mm",
            }
            : {
                sameDay: "YYYY-MM-DD([今日]) HH:mm",
                nextDay: "YYYY-MM-DD([明日]) HH:mm",
                lastDay: "YYYY-MM-DD([昨日]) HH:mm",
                nextWeek: "YYYY-MM-DD(dddd) hh:mm",
                lastWeek: "YYYY-MM-DD(dddd) hh:mm",
                sameElse: "YYYY-MM-DD(dddd) hh:mm",
            }
    );
    const endTimeStr = $moment(endTime).calendar(
        startTime,
        !isFull
            ? {
                sameDay: "HH:mm",
                nextDay: "[次日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "MM月DD日 hh:mm",
                lastWeek: "MM月DD日 hh:mm",
                sameElse: "MM月DD日 hh:mm",
            }
            : {
                sameDay: "HH:mm",
                nextDay: "[次日] HH:mm",
                lastDay: "[昨日] HH:mm",
                nextWeek: "YYYY-MM-DD(dddd) hh:mm",
                lastWeek: "YYYY-MM-DD(dddd) hh:mm",
                sameElse: "YYYY-MM-DD(dddd) hh:mm",
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
    return $moment(date).format(fmtStr);
}
