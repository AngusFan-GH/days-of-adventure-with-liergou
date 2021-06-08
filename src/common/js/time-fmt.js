const $moment = require('moment');

$moment.locale('zh_CN');

export function timeRangeFmt(startTime, endTime, isFull = false) {
    console.log(startTime, endTime, isFull);

    const isMissed = $moment(endTime).isBefore();
    if (isMissed) {
        return '已结束';
    }
    const isBegin = $moment(startTime).isBefore();
    if (isBegin) {
        return '已开始';
    }
    const startTimeStr = $moment(startTime).calendar(null, !isFull ? {
        sameDay: '[今日] HH:mm',
        nextDay: '[明日] HH:mm',
        lastDay: '[昨日] HH:mm',
        nextWeek: 'MM月DD日 hh:mm',
        lastWeek: 'MM月DD日 hh:mm',
        sameElse: 'MM月DD日 hh:mm'
    } : {
        sameDay: 'YYYY-MM-DD([今日]) HH:mm',
        nextDay: 'YYYY-MM-DD([明日]) HH:mm',
        lastDay: 'YYYY-MM-DD([昨日]) HH:mm',
        nextWeek: 'YYYY-MM-DD(dddd) hh:mm',
        lastWeek: 'YYYY-MM-DD(dddd) hh:mm',
        sameElse: 'YYYY-MM-DD(dddd) hh:mm'
    });
    const endTimeStr = $moment(endTime).calendar(startTime, !isFull ? {
        sameDay: 'HH:mm',
        nextDay: '[次日] HH:mm',
        lastDay: '[昨日] HH:mm',
        nextWeek: 'MM月DD日 hh:mm',
        lastWeek: 'MM月DD日 hh:mm',
        sameElse: 'MM月DD日 hh:mm'
    } : {
        sameDay: 'HH:mm',
        nextDay: '[次日] HH:mm',
        lastDay: '[昨日] HH:mm',
        nextWeek: 'YYYY-MM-DD(dddd) hh:mm',
        lastWeek: 'YYYY-MM-DD(dddd) hh:mm',
        sameElse: 'YYYY-MM-DD(dddd) hh:mm'
    });
    return `${startTimeStr}${isFull ? '~' : '-'}${endTimeStr}`;
}