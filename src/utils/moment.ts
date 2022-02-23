import Moment, { DurationInputArg1, MomentInput } from 'moment'

export const moment = Moment

export function differenceHours(date: moment.MomentInput) {
    return moment().diff(date, 'h')
}

export function differenceSec(date: moment.MomentInput) {
    return moment().diff(date, 's')
}

export function format(date: moment.MomentInput) {
    return moment(date).format('MMM D, YYYY h:mma')
}

export function difference(
    startTime: moment.MomentInput,
    endTime: moment.MomentInput
) {
    return moment.duration(moment(endTime).diff(moment(startTime)))
}

export function createDateFromTwoParams(
    date: MomentInput,
    time: DurationInputArg1
) {
    return moment(date).add(moment.duration(time, 'ms'), 'ms')
}
