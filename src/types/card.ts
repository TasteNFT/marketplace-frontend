import { ContractVersion } from '../utils/modules/contract/types'
import {
    ELotSaleType,
    ELotStatus,
    EMediaType,
    ETokenOriginalStatus,
    ETokenOriginalType,
    IBet,
    ILot,
    ILotTokenView,
    ITokenMediaView,
    ITokenNFTView,
} from './lot'
import { IUser } from './user'

export enum ECardType {
    originalToken = 'originalToken',
    lot = 'lot',
}

export type ICard = {
    id: string
    cardType: ECardType
    typeFile: EMediaType
    name: string
    description: string
    currentCost?: string
    minimalCost?: string
    moderatorMessage?: string
    isUseCensored: boolean
    status: ELotStatus | ETokenOriginalStatus
    expired?: Date
    copiesTotal: number
    copiesSold?: number
    isCommercial: boolean
    contents: ITokenMediaView[]
    marketplaceVer?: ContractVersion
    saleType?: ELotSaleType
    creatorReward?: number
    originalType: ETokenOriginalType

    LastBet?: IBet
    User?: IUser
    TokensNFT?: ITokenNFTView[]
    LotTokens?: ILotTokenView[]
    Lots?: ILot[]
}
