import { useEffect } from 'react'
import { useState } from 'react'
import { Margin } from '../../hoc/Margin'
import { Popup, PopupHalf, PopupHalfItem } from '../../hoc/Popup'
import { createDateFromTwoParams, difference, moment } from '../../utils/moment'
import { errors } from '../../utils/notification'
import { Button } from './Buttons'
import { InputWithState } from './Input'
import { lot as lotAPI } from '../../utils/api'
import { useContext } from 'react'
import { EventContext } from '../../ctx/event'
import { Moment } from 'moment'

interface TimerProps {
    dateBeforeInited?: Moment
    state: [number, (sec: number) => void]
}
export function SetTimer({ state, dateBeforeInited }: TimerProps) {
    const [date, setDate] = useState(
        dateBeforeInited?.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')
    )
    const [time, setTime] = useState(
        dateBeforeInited?.format('HH:mm') || moment().format('HH:mm')
    )
    const [, setSec] = state
    useEffect(() => {
        // if(!date && !time) return;
        const expiresOffsetSec = Math.round(
            difference(
                moment(),
                createDateFromTwoParams(date, time)
            ).asSeconds()
        )
        setSec(expiresOffsetSec)
    }, [date, time, setSec])
    return (
        <PopupHalf>
            <PopupHalfItem>
                <InputWithState
                    type="date"
                    state={[date, setDate]}
                ></InputWithState>
            </PopupHalfItem>
            <PopupHalfItem>
                <InputWithState
                    type="time"
                    state={[time, setTime]}
                ></InputWithState>
            </PopupHalfItem>
        </PopupHalf>
    )
}

export function UpdateTimer({
    state,
    lotId,
    expiresAt,
}: {
    state: [boolean, (state: boolean) => void]
    lotId: string
    expiresAt?: Date
}) {
    const [expSec, setExpSec] = useState(0)
    const [showNewTimer, setShowNewTimer] = state
    const { onTimerUpdated } = useContext(EventContext)

    async function update() {
        if (expSec < 86400) {
            errors.minExpire()
            return
        }
        const lot = await lotAPI
            .update({
                lotId,
                expiresOffsetSec: expSec,
            })
            .then((res) => res.data)
        setShowNewTimer(false)
        if (onTimerUpdated) onTimerUpdated(lot)
    }
    return (
        <Popup
            showState={[showNewTimer, setShowNewTimer]}
            title="Changing ending time"
        >
            <>
                <SetTimer
                    state={[expSec, setExpSec]}
                    dateBeforeInited={expiresAt ? moment(expiresAt) : undefined}
                ></SetTimer>
                <Margin margin={{ top: 20 }}>
                    <Button fill onClick={update}>
                        Save
                    </Button>
                </Margin>
            </>
        </Popup>
    )
}
