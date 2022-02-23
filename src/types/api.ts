import { AxiosResponse } from 'axios'
import { ELotSaleType, ELotStatus } from './lot'
import { IUser } from './user'

export type TRes<T> = Promise<AxiosResponse<T>>

export type TRow<T> = {
    page: number
    pageSize: number
    rows: T[]
    totalRows: number
    sortBy?: string
    sortDesc?: boolean
}

export interface IAuthResponse {
    expirationTs: number
    token: string
    refreshToken: string
    user: IUser
}

export interface ParamsBasic {
    page?: number
    sortDesc?: boolean
}

export interface paramsFetchLots extends ParamsBasic {
    sortBy?:
        | 'lastActiveAt'
        | 'createdAt'
        | 'updatedAt'
        | 'currentCost'
        | 'viewsRating'
        | 'expiresAt'

    // filters:
    search?: string
    status?: ELotStatus
    updateAtIsAfter?: Date // string
    categoryId?: string // bigint
    userId?: string // bigint
    saleType?: ELotSaleType
    hasATimeLimit?: '0' | '1' // aka boolean
}

export interface paramsOriginalTokenGet {
    sortBy?: 'id' | 'updatedAt' | 'createdAt'

    // filters:
    name?: string
    categoryId?: string // bigint
    userId?: string // bigint
}

export interface ResCoinBitPrice {
    time: string
    asset_id_base: string
    asset_id_quote: string
    rate: number
}
export interface ResPancakeswapPrice {
    updated_at: string
    data: {
        name: string
        symbol: string
        price: string
        price_BNB: string
    }
}
export enum Errors {
    common_unauthorized = 'common.unauthorized',
    common_forbidden = 'common.forbidden',
    common_request_timeout = 'common.request_timeout',
    common_payload_too_large = 'common.payload_too_large',

    file_bad_mime_type = 'file.bad_mime_type',

    user_bad_passwort_reset_code = 'user.bad_passwort_reset_code',
    user_not_found = 'user.not_found',
    user_role_isnt_user = 'user.role_isnt_user',
    user_role_isnt_guest = 'user.role_isnt_guest',

    lot_not_found = 'lot.not_found',
    lot_isnt_sale_type = 'lot.isnt_sale_type',
    lot_isnt_auction_type = 'lot.isnt_auction_type',
    lot_isnt_sale_status = 'lot.isnt_sale_status',

    lot_token_not_found = 'lot_token.not_found',
    lot_token_not_available_for_buy = 'lot_token.not_available_for_buy',

    token_nft_not_found = 'token_nft.not_found',

    lot_bet_not_found = 'lot_bet.not_found',
    lot_bet_isnt_top_bet = 'lot_bet.isnt_top_bet',
    lot_bet_low_delay_before_bet_cancel = 'lot_bet.low_delay_before_bet_cancel',
    lot_bet_bet_user_is_equal_lot_user = 'lot_bet.bet_user_is_equal_lot_user',

    token_original_not_found = 'token_original.not_found',
    token_original_status_isnt_validation = 'token_original.status_isnt_validation',
    token_original_status_isnt_draft = 'token_original.status_isnt_draft',
    token_original_status_isnt_ban_or_draft = 'token_original.status_isnt_ban_or_draft',
    token_original_max_10_orgs_in_process = 'token_original.max_10_orgs_in_process',
    token_original_contents_not_load = 'token_original.contents_not_load',
    token_original_bad_file_content_type = 'token_original.bad_file_content_type',
    token_original_import_faild_load_meta_data = 'token_original.import_faild_load_meta_data',
    token_original_import_image_url_not_math = 'token_original.import_image_url_not_math',
    token_original_nft_isnt_approved = 'token_original.nft_isnt_approved',

    task_not_found = 'task.not_found',

    web3_smallBalance = 'web3.smallBalance',
    web3_smallApproval = 'web3.smallApproval',

    metamask_bad_message = 'metamask.bad_message',
    metamask_user_is_exist = 'metamask.user_is_exist',
}
