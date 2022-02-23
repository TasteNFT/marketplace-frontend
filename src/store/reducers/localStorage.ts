import { SavedContracts } from '../../types/app'
import { importContractStorage } from '../../utils/localStorage'
import {
    type_LOCAL_STORE_CONTRACTS_ADD,
    type_LOCAL_STORE_CONTRACTS_REMOVE,
} from '../types'

export const initialState = {
    importedContract: importContractStorage.get(),
}

export type action_LocalStoreContractsAdd = {
    type: typeof type_LOCAL_STORE_CONTRACTS_ADD
    payload: SavedContracts
}
export type action_LocalStoreContractsRemove = {
    type: typeof type_LOCAL_STORE_CONTRACTS_REMOVE
    payload: { tag: string }
}

export const localStorageReducer = (
    state = initialState,
    action: action_LocalStoreContractsAdd | action_LocalStoreContractsRemove
) => {
    switch (action.type) {
        case type_LOCAL_STORE_CONTRACTS_ADD:
            return (() => {
                if (!action.payload.tag || !action.payload.contract)
                    return state
                importContractStorage.add(
                    action.payload.tag,
                    action.payload.contract
                )
                const newState: typeof initialState = {
                    ...state,
                    importedContract: importContractStorage.get(),
                }
                return newState
            })()

        case type_LOCAL_STORE_CONTRACTS_REMOVE:
            return (() => {
                importContractStorage.remove(action.payload.tag)
                const newState: typeof initialState = {
                    ...state,
                    importedContract: importContractStorage.get(),
                }
                return newState
            })()

        default:
            return state
    }
}
