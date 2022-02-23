import { type_POPUP_LOADING, type_POPUP_ONBOARD } from '../types'
import { IAction_onboard } from '../reducers/popupReducer'

export function action_setOnboard(payload: boolean): IAction_onboard {
    return {
        type: type_POPUP_ONBOARD,
        payload,
    }
}

export function action_setLoading(payload: boolean): IAction_onboard {
    return {
        type: type_POPUP_LOADING,
        payload,
    }
}
