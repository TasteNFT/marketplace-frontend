import { createContext } from 'react'
import { ImportedMetaData } from '../types/app'
import { ILot, ITokenOriginalView } from '../types/lot'
import { IUser } from '../types/user'

export const EventContext = createContext<{
    onCardRemove?: (id: string) => void
    onCardUpdated?: () => void
    onCardCreated?: () => void
    onCardHided?: (id: string) => void
    onBet?: () => void
    onEditorCreated?: (data: ITokenOriginalView) => void
    onEditorErrorSendFile?: (data: ITokenOriginalView) => void
    onPaginationPage?: (page: number) => void
    onTimerEnd?: (payload: any) => void
    onTimerDetailEnd?: (payload: any) => void
    onLotBuy?: () => void
    onTimerUpdated?: (lot: ILot) => void
    onFollowed?: (user: IUser) => void
    onImportedToken?: (token: ImportedMetaData) => void
}>({})
