import { useHistory, useLocation } from 'react-router-dom'
import qs from 'query-string'
import { useCallback, useMemo } from 'react'
// import { history } from '..'

export function useQuery(name?: string) {
    const history = useHistory()
    const { search, pathname, state } = useLocation()

    const setValue = useCallback(
        (value: string | string[]) => {
            if (!name) return
            const query = new Map(
                Object.entries(qs.parse(window.location.search))
            ).set(name, value)

            const search = qs.stringify(Object.fromEntries(query))

            history.replace({
                pathname,
                search,
                state,
            })
        },
        [history, name, pathname, state]
    )

    const getValue = useCallback(() => {
        if (!name) return
        return new Map(Object.entries(qs.parse(search))).get(name)
    }, [name, search])

    return useMemo(
        () => ({
            setValue,
            getValue,
        }),
        [setValue, getValue]
    )
}
