import { MomentInput } from 'moment'
import { useCallback, useContext, useEffect, useState } from 'react'
import { EventContext } from '../ctx/event'
import { difference, moment } from '../utils/moment'

export function useTimer(expieresAt?: MomentInput, payload?: any) {
    const [res, setRes] = useState<string>()
    const { onTimerEnd } = useContext(EventContext)

    const interval = useCallback(() => {
        const diff = difference(moment(), moment(expieresAt).local())
        if (diff.asSeconds() <= 60) {
            if (onTimerEnd) onTimerEnd(payload)
            return
        }
        setRes(diff.humanize())
    }, [expieresAt, onTimerEnd, payload])

    useEffect(() => {
        if (!expieresAt) {
            return
        }
        interval()

        const id = setInterval(interval, 1000)
        return () => clearInterval(id)
    }, [expieresAt, interval])

    return res
}
