import { IAuthResponse } from '../types/api'
import { SavedContracts } from '../types/app'
import { json } from './json'
import { moment } from './moment'

const NAME_TOKEN_FIELD = 'jwt_token'
const NAME_REFRESH_TOKEN_FIELD = 'refresh_token'
const NAME_DATE_FIELD = 'login_date'

export function setAuth(data: IAuthResponse) {
    localStorage.setItem(NAME_TOKEN_FIELD, data.token)
    localStorage.setItem(NAME_REFRESH_TOKEN_FIELD, data.refreshToken)
    localStorage.setItem(NAME_DATE_FIELD, moment().format())
}

export function removeAuth() {
    localStorage.removeItem(NAME_TOKEN_FIELD)
    localStorage.removeItem(NAME_REFRESH_TOKEN_FIELD)
    localStorage.removeItem(NAME_DATE_FIELD)
}

export function getJWT() {
    return localStorage.getItem(NAME_TOKEN_FIELD)
}

export function getLoginDate() {
    return localStorage.getItem(NAME_DATE_FIELD)
}

export function getRefreshToken() {
    return localStorage.getItem(NAME_REFRESH_TOKEN_FIELD)
}

export const localStorageJSON = {
    setItem(key: string, value: any[]) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    getItem<T>(key: string) {
        const item = localStorage.getItem(key)
        return json.parse<T>(item)
    },
}

export const importContractStorage = {
    add(tag: string, contract: string) {
        const oldData =
            localStorageJSON.getItem<SavedContracts[]>('import_contracts')
        localStorageJSON.setItem('import_contracts', [
            ...(oldData?.filter((o) => o.tag !== tag) || []),
            { tag, contract },
        ])
    },
    remove(tag: string) {
        const oldData =
            localStorageJSON.getItem<SavedContracts[]>('import_contracts')
        localStorageJSON.setItem(
            'import_contracts',
            oldData?.filter((o) => o.tag !== tag) || []
        )
    },
    get() {
        return localStorageJSON.getItem<SavedContracts[]>('import_contracts')
    },
}
