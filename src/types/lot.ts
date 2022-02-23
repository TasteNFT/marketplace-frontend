import { IUser } from './user'

export enum ELotType {
    ORIGINAL = 'ORIGINAL',
    COPY = 'COPY',
}

export enum ELotSaleType {
    AUCTION = 'AUCTION',
    SALE = 'SALE',
}

export enum ELotStatus {
    IN_SALES = 'IN_SALES',
    CLOSED = 'CLOSED',
}
export enum ETokenOriginalStatus {
    BAN = 'BAN',
    DRAFT = 'DRAFT',
    IMPORT_TASK = 'IMPORT_TASK',
    IMPORT_FAIL = 'IMPORT_FAIL',
    VALIDATION = 'VALIDATION',
    TASK = 'TASK',
    PUBLISHED = 'PUBLISHED',
}

export enum EMediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
}

export enum EIpfsItemType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

export enum ECurrencyType {
    BNB = 'BNB',
}

export type ILotContentData = {
    sha256: string // sha256 for route: /sha256/:sha256
    type: EIpfsItemType
}

export interface IPlaceABetRequset {
    lotId: string // bigint
    betAmount: string // Desimal
}

export interface ITokenNFTView {
    id: string
    userId: string
    tokenOriginalId: string
    token: string
    index: number
    currentLotId: string | null
    createdAt: Date

    User?: IUser
    TokenOriginal?: ITokenOriginalView
    CurrentLot?: ILot
    LotTokens?: ILotTokenView[]
    LotBets?: IBet[]
}
export interface ITokenMediaView {
    lotId: string
    sha256: string
    type: EMediaType
    mime: string
    isOriginal: boolean
    isConverted: boolean
    isPreview: boolean
    isCensored: boolean
    isWatermark: boolean
}
export interface ILotTokenView {
    id: string
    lotId: string
    tokenNftId: string
    isSold: boolean
    isProcessin: boolean

    Lot?: ILot
    TokenNFT?: ITokenNFTView
}
export enum ETokenOriginalType {
    LOCAL = 'LOCAL',
    IMPORT = 'IMPORT',
}
export interface ITokenOriginalView {
    id: string
    type: ETokenOriginalType
    status: ETokenOriginalStatus
    userId: string
    contentType: EMediaType
    categoryId: string | null
    isUseCensored: boolean
    name: string
    description: string
    moderatorMessage: string | null
    copiesTotal: number
    createdAt: Date
    updatedAt: Date
    isCommercial: boolean
    creatorReward: number
    importAddr: null | string
    importTokenId: null | string

    User?: IUser
    TokensNFT?: ITokenNFTView[]
    TokenMedias?: ITokenMediaView[]
    Lots?: ILot[]
}
export interface ILot {
    id: string
    type: ELotType
    saleType: ELotSaleType
    userId: string
    status: ELotStatus
    currencyType: ECurrencyType
    minimalCost: string
    currentCost: string
    copiesSold: number
    copiesTotal: number
    expiresAt: Date | null
    lastBetAt: Date | null
    updatedAt: Date
    createdAt: Date
    isTop: boolean
    marketplaceVer: number

    User?: IUser
    TokenOriginal?: ITokenOriginalView
    Bets?: IBet[]
    LotTokens?: ILotTokenView[]
}
export interface IBet {
    id: string
    lotId: string
    userId: string
    eftTokenId: string
    currencyType: ECurrencyType
    betAmount: string
    isWin: boolean
    createdAt: Date
    updatedAt: Date
    Lot?: ILot
    User?: IUser
    TokenNFT?: ITokenNFTView
}
export enum TokenHistoryType {
    ORG_PUBLISHED = 'ORG_PUBLISHED',
    LOT_CREATED = 'LOT_CREATED',
    LOT_CLOSED = 'LOT_CLOSED',
    LOT_BET_CREATED = 'LOT_BET_CREATED',
    LOT_BET_CANCEL = 'LOT_BET_CANCEL',
    NFT_TOKEN_ADDED = 'NFT_TOKEN_ADDED',
    NFT_TOKEN_PUT_UP_FOR_SALE = 'NFT_TOKEN_PUT_UP_FOR_SALE',
    NFT_TOKEN_CHANGED_OWNER_BET = 'NFT_TOKEN_CHANGED_OWNER_BET',
    NFT_TOKEN_CHANGED_OWNER_SALE = 'NFT_TOKEN_CHANGED_OWNER_SALE',
}
export interface TokenHistoryView {
    id: string
    type: TokenHistoryType
    tokenOriginalId: string
    tokenNftId: string | null
    userId: string | null
    lotId: string | null
    betId: string | null
    buyPrice: string | null // Desimal (wei)
    createdAt: Date
    updatedAt: Date

    TokenOriginal?: ITokenOriginalView // ALL TYPES
    TokenNFT?: ITokenNFTView // ALL NFT TOKEN TYPES
    User?: IUser // NFT_TOKEN_ADDED, NFT_TOKEN_PUT_UP_FOR_SALE, NFT_TOKEN_CHANGED_OWNER_BET
    UserOldOwner?: IUser
    Lot?: ILot // ALL LOT TYPES
    Bet?: IBet // NFT_TOKEN_PUT_UP_FOR_SALE
}

export type signsData = {
    tokenNftId: string
    sign: string
}
export type PlaceABetParams = {
    lotId: string // bigint
    betAmount: string // Desimal
    buyerSignsData: signsData[]
}
