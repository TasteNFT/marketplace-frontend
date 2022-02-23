import { useCallback, useEffect, useMemo, useState } from 'react'

interface Radio<T> {
    // label: string
    value: [T, (val: T) => void]
    indexes: T[]
}
export function useRadio<T extends string>({ value, indexes }: Radio<T>) {
    const [picked, setPicked] = value

    type obj = { [K in T]: boolean }

    const initial = useMemo<obj>(
        () => indexes.reduce((acc, i) => ({ ...acc, [i]: false }), {}) as obj,
        [indexes]
    )

    const [mainState, setMainState] = useState<obj>(initial)

    const pick = useCallback(
        (index: T) => {
            setMainState((oldMainState) => {
                const modified = Object.entries(oldMainState).map(([key]) => {
                    return [key, false]
                })
                return { ...Object.fromEntries(modified), [index]: true }
            })
            setPicked(index)
        },
        [setPicked]
    )

    useEffect(() => {
        pick(picked)
    }, [pick, picked])

    return {
        setState(index: T) {
            setPicked(index)
        },
        mainState,
    }
}
