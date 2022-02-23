import { IMetamask_resMessage } from '../../types/metamask'
import { del, get, post, setToken } from './axios'
import axios from 'axios'
import { IUser, IUserRequest } from '../../types/user'
import {
    ILot,
    IBet,
    ITokenOriginalView,
    signsData,
    TokenHistoryType,
    TokenHistoryView,
    EMediaType,
    ELotSaleType,
} from '../../types/lot'
import {
    IAuthResponse,
    ParamsBasic,
    paramsFetchLots,
    paramsOriginalTokenGet,
    ResCoinBitPrice,
    ResPancakeswapPrice,
    TRes,
    TRow,
} from '../../types/api'
import { AuthLots } from './types'

export const metamask = {
    message(address: string): TRes<IMetamask_resMessage> {
        return get('/metamask/message', {
            params: {
                metamaskAddress: address,
            },
        })
    },
    login(
        metamaskAddress: string,
        metamaskSignature: string,
        chainId: string
    ): TRes<IAuthResponse> {
        return post('/metamask/login', {
            metamaskAddress,
            metamaskSignature,
            chainId,
        }).then((data) => {
            setToken(data.data)
            return data
        })
    },
    register(
        metamaskAddress: string,
        metamaskSignature: string,
        chainId: string,
        metamaskMessage: string
    ): TRes<IAuthResponse> {
        return post('/metamask/register', {
            metamaskAddress,
            metamaskSignature,
            chainId,
            metamaskMessage,
        }).then((data) => {
            setToken(data.data)
            return data
        })
    },
}

export const auth = {
    fetch(): TRes<IUser> {
        return get('/user')
    },
    logout(): TRes<unknown> {
        return post('/user/logout')
    },
    update(data: IUserRequest): TRes<string> {
        return post('/user/settings_update', data)
    },
    updateAvatar(image: File): TRes<any> {
        const formData = new FormData()
        formData.append('user_avatar', image)
        return post('/user/upload_avatar', formData)
    },
    deleteAvatar(): TRes<{ sha256: string }> {
        return del(`/user/avatar`)
    },
    updateBackground(image: File): TRes<any> {
        const formData = new FormData()
        formData.append('user_background', image)
        return post('/user/upload_background', formData)
    },
    deleteBackground(): TRes<{ sha256: string }> {
        return del(`/user/background`)
    },
    lotsCollected(params?: ParamsBasic): TRes<TRow<ITokenOriginalView>> {
        return get('/user/tokens_original/collected', { params })
    },
    lotsCreated(params?: AuthLots): TRes<TRow<ITokenOriginalView>> {
        return get(`/user/tokens_original/created`, { params })
    },
    lotsBets(params?: ParamsBasic): TRes<TRow<ILot>> {
        return get(`/user/lots/with_active`, { params })
    },
    lot(id: string): TRes<ITokenOriginalView> {
        return get(`/user/lots/${id}`)
    },
    follow(userId: string) {
        return post('/user/following_put', { userId })
    },
    unfollow(userId: string) {
        return post('/user/following_delete', { userId })
    },
    ownedItems(params: {
        contractAddress: string
        ownerAddress: string
    }): TRes<{ id: string; metadata: string | null }[]> {
        return post(`/user/get_owned_items`, params)
    },
    importedOriginalTokens(params?: {
        marketAddr?: string
    }): TRes<{ [key: string]: string[] }> {
        return get(`/user/trid_party_tokens`, { params })
    },
}

export const lot = {
    get(params?: paramsFetchLots): TRes<TRow<ILot>> {
        return get(`/market/lots`, { params })
    },
    id(id: string): TRes<ILot> {
        return get(`/market/lots/${id}`)
    },
    update(data: {
        lotId: string // bigint
        expiresOffsetSec: number | null
    }): TRes<ILot> {
        return post(`/market_create/lot_update`, data)
    },
    placeABet(data: {
        lotId: string
        betAmount: string
        buyerSignsData: signsData[]
    }): TRes<IBet> {
        return post(`/market_actions/place_a_bet`, data)
    },
    cancelABet(data: { lotBetId: string }) {
        return post(`/market_actions/cancel_bet`, data)
    },
    buy(data: {
        lotId: string // bigint
        tokenNftId: string // bigint
        buyerSignData: string // for tokenNftId
    }) {
        return post(`/market_actions/buy_lot_token`, data)
    },
    finishAuction(data: { lotId: string }): TRes<ILot> {
        return post(`/market_actions/close_lot_action`, data)
    },
    bets(id: string): TRes<TRow<IBet>> {
        return get(`/market/bets`, {
            params: {
                lotId: id,
                sortBy: 'betAmount',
            },
        })
    },
    /**
     *
     * @param id id нфт токена
     * @param sign подписанная транзакция
     * @returns {TRes<ILot>}
     */
    create(
        data: {
            saleType: ELotSaleType
            tokenOriginalId: string
            minimalCost: string // Desimal
            expiresOffsetSec?: number | null
            sellerSignsData: signsData[]
        },
        options?: { oldContract?: boolean }
    ): TRes<ILot> {
        const headers = (() => {
            let res = {}
            if (options?.oldContract) {
                res = { ...res, 'X-Old-Marketplace-Ver-l9x71a47p': 2 }
            }
            return res
        })()
        return post(`/market_create/lot`, data, {
            headers,
        })
    },
    top(): TRes<ILot[]> {
        return get('/market/top_lots')
    },
}

export const originalToken = {
    get(params?: paramsOriginalTokenGet): TRes<TRow<ITokenOriginalView>> {
        return get(`/market/tokens_original`, { params })
    },
    id(id: string): TRes<ITokenOriginalView> {
        return get(`/market/tokens_original/${id}`)
    },
    create(data: {
        id?: string
        name: string
        description: string
        isUseCensored: boolean
        contentType: EMediaType
        copiesTotal: number // min 1, max 10
        isCommercial: boolean
        creatorReward: 0 | 5 | 10 | 15
    }): TRes<ITokenOriginalView> {
        return post('/market_create/original', data)
    },
    import(data: {
        contract: string
        tokenId: string
        name: string
        description: string
        image: string
        isUseCensored: boolean
        copiesTotal: number // min 1, max 10
        isCommercial: boolean
        creatorReward: 0 | 5 | 10 | 15
    }) {
        return post<ITokenOriginalView>('/market_create/import', data)
    },
    update(
        id: string,
        data: {
            id?: string
            name: string
            description: string
            isUseCensored: boolean
            contentType: EMediaType
            copiesTotal: number // min 1, max 10
            isCommercial: boolean
            creatorReward: 0 | 5 | 10 | 15
        }
    ): TRes<ITokenOriginalView> {
        return post(`/market_create/original/${id}/update_draft`, data)
    },
    upload(id: string, file: File) {
        const formData = new FormData()
        formData.append('file', file)
        return post(`/market_create/original/${id}/upload`, formData)
    },
    complete(id: string) {
        return post(`/market_create/original/${id}/draft_complete`)
    },
    delete(id: string): TRes<string> {
        return del(`/user/tokens_original/${id}`)
    },
    history(
        params: {
            sortBy?: 'id'
            sortDesc?: boolean
            page?: number

            // filters:
            type?: TokenHistoryType[] //
            tokenOriginalId?: string // bigint
            tokenNftId?: string // bigint
            tokenChangedOwnerWithUserId?: string
            userId?: string // bigint
            lotId?: string // bigint
            betId?: string // bitint
        } = {}
    ): TRes<TRow<TokenHistoryView>> {
        return get(`/market/token_history`, {
            params,
        })
    },
}

export const user = {
    get(
        params: {
            sortBy?:
                | 'id'
                | 'name'
                | 'metaName'
                | 'createdAt'
                | 'totalSalesCount'
            sortDesc?: boolean
            id?: string
            name?: string
        } = {}
    ): TRes<TRow<IUser>> {
        return get(`/market/users`, { params })
    },
    id(id: string): TRes<IUser> {
        return get(`/market/users/${id}`)
    },
    metanameOrId(metaNameOrId: string): TRes<IUser> {
        return get(`/market/user_by_metaname_or_id/${metaNameOrId}`)
    },
    featured(): TRes<IUser[]> {
        return get(`/market/featured_users`)
    },
    following: {
        followers(id: string, params?: { page: number }): TRes<TRow<IUser>> {
            return get(`/market/users/${id}/followers`, { params })
        },
        followings(id: string, params?: { page: number }): TRes<TRow<IUser>> {
            return get(`/market/users/${id}/followings`, { params })
        },
    },
    tokenOriginal: {
        created(
            id: string,
            params?: ParamsBasic
        ): TRes<TRow<ITokenOriginalView>> {
            return get(`/market/users/${id}/token_originals_created`, {
                params,
            })
        },
        collected(
            id: string,
            params?: ParamsBasic
        ): TRes<TRow<ITokenOriginalView>> {
            return get(`/market/users/${id}/token_originals_collected`, {
                params,
            })
        },
        bets(id: string, params?: ParamsBasic): TRes<TRow<ILot>> {
            return get(`/market/users/${id}/lots_with_active`, { params })
        },
        hidden: {
            create(id: string) {
                return post('/user/hidden_originals', { tokenOriginalId: id })
            },
            remove(id: string) {
                return del(`/user/hidden_originals/${id}`)
            },
        },
    },
}

export const coinsbit = {
    getPrice(): TRes<ResCoinBitPrice> {
        return axios.get(`https://rest.coinapi.io/v1/exchangerate/TASTE/USD`, {
            headers: {
                'X-CoinAPI-Key': '8C2F6261-220E-40C0-958A-D39BDBCA68D1',
            },
        })
    },
}

export const pancakeswap = {
    getPrice(): TRes<ResPancakeswapPrice> {
        return get('/pancakeswap')
        // return axios.get(
        //     `https://api.pancakeswap.info/api/v2/tokens/0xdB238123939637D65a03E4b2b485650B4f9D91CB`
        // )
    },
}
