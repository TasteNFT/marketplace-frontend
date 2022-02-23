import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type LocationState = { search?: string; pageYOffset?: number }

export function useTypedLocation() {
    const location = useLocation<LocationState | undefined>()
    const history = useHistory<LocationState | undefined>()

    const set = useCallback(
        <T extends keyof LocationState>(key: T, value: LocationState[T]) => {
            history.push({
                pathname: location.pathname,
                state: { ...location.state, [key]: value },
                search: location.search,
            })
        },
        [location, history]
    )

    const setPageYOffset = useCallback(() => {
        set('pageYOffset', window.scrollY)
    }, [set])

    const scrollToFromLocation = useCallback(() => {
        setImmediate(() => window.scrollTo(0, location.state?.pageYOffset || 0))
    }, [location.state])

    return {
        location,
        history,
        setPageYOffset,
        scrollToFromLocation,
    }
}
