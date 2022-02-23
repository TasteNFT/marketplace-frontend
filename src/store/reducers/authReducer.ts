import { IUser, EUserRole } from '../../types/user'
import { type_AUTH_FETCH_USER } from '../types'

export const initialState: IUser = {
    name: '',
    id: '',
    email: '',
    description: '',
    metaName: '',
    avatar: '',
    createdAt: '',
    isActivated: false,
    role: EUserRole.Guest,
    socialInstagram: '',
    socialOnlyfans: '',
    socialTwitch: '',
    socialTwitter: '',
    metamaskAddress: '',
    totalSalesProfit: '0',
    totalSalesCount: 0,
    background: null,
}

export type IAction_userFetch = {
    type: typeof type_AUTH_FETCH_USER
    payload: IUser
}

type TAction = IAction_userFetch

export const authReducer = (state = initialState, action: TAction) => {
    switch (action.type) {
        case type_AUTH_FETCH_USER:
            return (state = action.payload)

        default:
            return state
    }
}
