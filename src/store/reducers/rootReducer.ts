import { combineReducers } from 'redux'
import { authReducer } from './authReducer'
import { localStorageReducer } from './localStorage'
import { popupReducer } from './popupReducer'

export const rootReducer = combineReducers({
    auth: authReducer,
    popup: popupReducer,
    localStorage: localStorageReducer,
})

export type TReducer = ReturnType<typeof rootReducer>
