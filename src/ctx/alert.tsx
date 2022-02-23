import { useMemo } from 'react'
import { createContext, useContext, useState } from 'react'
import { Popup } from '../hoc/Popup'

type ResF = (res: boolean) => void
export interface AlertContext {
    show: [boolean, (state: boolean) => void]
    message: [string, (state: string) => void]
    result: ResF | null
}
export const useAlertInitialState = () => {
    const show = useState(false)
    const message = useState('')
    let result = null
    return {
        show,
        message,
        result,
    }
}
export const AlertContext = createContext<AlertContext | null>(null)

export function Alert() {
    const ctx = useContext(AlertContext)
    if (!ctx) return null

    function yes() {
        // console.log(ctx)
        if (ctx?.result) {
            ctx.result(true)
        }
    }
    return (
        <Popup showState={ctx.show} title="alert">
            <div>
                <button onClick={yes}>ok</button>
            </div>
        </Popup>
    )
}

export const useAlert = () => {
    let ctx = useContext(AlertContext)
    if (!ctx) return
    const [showState, setShow] = ctx.show
    const [message, setMessage] = ctx.message

    return {
        confirm: (msg: string) => {
            setShow(true)
            setMessage(msg)

            return new Promise((res, rej) => {
                ctx!.result = (b: boolean) => {
                    setShow(false)
                    setMessage('')
                    b ? res(b) : rej(b)
                }
                // console.log('qwdwqdq', ctx)
            })
        },
    }
}
