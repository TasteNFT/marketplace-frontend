import { type_POPUP_LOADING, type_POPUP_ONBOARD } from '../types'

export const initialState = {
    onboard: false,
    loading: false,
}

type TType = typeof type_POPUP_ONBOARD | typeof type_POPUP_LOADING

export type IAction_onboard = {
    type: TType
    payload: boolean
}

export const popupReducer = (
    state = initialState,
    { type, payload }: IAction_onboard
) => {
    switch (type) {
        case type_POPUP_ONBOARD:
            return { ...state, onboard: payload }
        case type_POPUP_LOADING:
            return { ...state, loading: payload }
        default:
            return state
    }
}
