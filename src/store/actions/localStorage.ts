import { SavedContracts } from '../../types/app'
import {
    action_LocalStoreContractsAdd,
    action_LocalStoreContractsRemove,
} from '../reducers/localStorage'
import {
    type_LOCAL_STORE_CONTRACTS_ADD,
    type_LOCAL_STORE_CONTRACTS_REMOVE,
} from '../types'

export function actionLocalStorageContractsAdd(
    importedJSON: SavedContracts
): action_LocalStoreContractsAdd {
    return {
        type: type_LOCAL_STORE_CONTRACTS_ADD,
        payload: importedJSON,
    }
}
export function actionLocalStorageContractsRemove(
    tag: string
): action_LocalStoreContractsRemove {
    return {
        type: type_LOCAL_STORE_CONTRACTS_REMOVE,
        payload: { tag },
    }
}
