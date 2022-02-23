import { initialState } from '../reducers/authReducer'
import { auth } from '../../utils/api/index'
import { type_AUTH_FETCH_USER } from '../types'
import { IUser } from '../../types/user'
import { getJWT, removeAuth } from '../../utils/localStorage'
import { AppDispatch } from '..'

export function action_authFetch() {
    return async (dispatch: AppDispatch) => {
        const jwt = getJWT()
        if (!jwt) return

        const payload = await auth
            .fetch()
            .then((res) => res.data)
            .catch(() => initialState)
        dispatch({
            type: type_AUTH_FETCH_USER,
            payload,
        })
    }
}

export function action_setAuth(user: IUser) {
    return {
        type: type_AUTH_FETCH_USER,
        payload: user,
    }
}

export function action_logout() {
    return async (dispatch: AppDispatch) => {
        await auth.logout().catch(() => console.error('Error logout'))

        removeAuth()

        dispatch({
            type: type_AUTH_FETCH_USER,
            payload: initialState,
        })
    }
}
