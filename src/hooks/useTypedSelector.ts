import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { TReducer } from '../store/reducers/rootReducer'

export const useTypedSelector: TypedUseSelectorHook<TReducer> = useSelector
