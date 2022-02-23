import { history } from '../..'
import { Errors } from '../../types/api'
import { errors } from '../notification'

export enum ExType {
    ExError = 'ex_error',
    ExFields = 'ex_fields',
    ExUnknown = 'ex_unknown',
}

export interface ExBase {
    code: number
}
export interface ExError extends ExBase {
    exType: ExType.ExError
    error: Errors
}
export interface ExFields extends ExBase {
    exType: ExType.ExFields
    fields: { [field: string]: { errors: string[] } } // for ExType.ExFields type
}
export interface ExUnknown extends ExBase {
    exType: ExType.ExUnknown
}

export type Ex = ExFields | ExError | ExUnknown

export const ExErrors = [
    {
        code: 401,
        error: Errors.common_unauthorized,
    },
    {
        code: 403,
        error: Errors.common_forbidden,
    },
    {
        code: 408,
        error: Errors.common_request_timeout,
    },
    {
        code: 413,
        error: Errors.common_payload_too_large,
    },
    {
        code: 415,
        error: Errors.file_bad_mime_type,
    },

    {
        code: 400,
        error: Errors.user_bad_passwort_reset_code,
    },
    {
        code: 404,
        error: Errors.user_not_found,
    },
    {
        code: 412,
        error: Errors.user_role_isnt_user,
    },
    {
        code: 412,
        error: Errors.user_role_isnt_guest,
    },
    {
        code: 404,
        error: Errors.lot_not_found,
    },
    {
        code: 412,
        error: Errors.lot_isnt_sale_type,
    },
    {
        code: 412,
        error: Errors.lot_isnt_auction_type,
    },
    {
        code: 412,
        error: Errors.lot_isnt_sale_type,
    },
    {
        code: 404,
        error: Errors.lot_token_not_found,
    },
    {
        code: 412,
        error: Errors.lot_token_not_available_for_buy,
    },
    {
        code: 404,
        error: Errors.token_nft_not_found,
    },
    {
        code: 404,
        error: Errors.lot_bet_not_found,
    },
    {
        code: 412,
        error: Errors.lot_bet_isnt_top_bet,
    },
    {
        code: 412,
        error: Errors.lot_bet_low_delay_before_bet_cancel,
    },
    {
        code: 412,
        error: Errors.lot_bet_bet_user_is_equal_lot_user,
    },
    {
        code: 404,
        error: Errors.token_original_not_found,
    },
    {
        code: 412,
        error: Errors.token_original_status_isnt_validation,
    },
    {
        code: 412,
        error: Errors.token_original_status_isnt_draft,
    },
    {
        code: 412,
        error: Errors.token_original_status_isnt_ban_or_draft,
    },
    {
        code: 412,
        error: Errors.token_original_max_10_orgs_in_process,
    },
    {
        code: 412,
        error: Errors.token_original_contents_not_load,
    },
    {
        code: 412,
        error: Errors.token_original_bad_file_content_type,
    },
    {
        code: 412,
        error: Errors.token_original_import_faild_load_meta_data,
    },
    {
        code: 412,
        error: Errors.token_original_import_image_url_not_math,
    },
    {
        code: 412,
        error: Errors.token_original_nft_isnt_approved,
    },
    {
        code: 404,
        error: Errors.task_not_found,
    },

    {
        code: 412,
        error: Errors.web3_smallBalance,
    },
    {
        code: 412,
        error: Errors.web3_smallApproval,
    },
    {
        code: 412,
        error: Errors.metamask_bad_message,
    },
    {
        code: 418,
        error: Errors.metamask_user_is_exist,
    },
]

export function getError(field: string, code: string) {
    const switcher = `${field}|${code}`
    switch (switcher) {
        case 'email|isUsed':
            errors.emailIsUsed()
            break
        case 'metaName|isUsed':
            errors.metaNameIsUsed()
            break
        case 'betAmount|smallBalance':
            errors.smallBalance()
            break
        default:
            break
    }
}

export function errorHandler(e: any) {
    const ex = e.response.data as Ex
    const code = e.response.status as number

    switch (code) {
        case 422:
            ex.exType === ExType.ExFields &&
                Object.entries(ex.fields).forEach((f) => {
                    const [field, data] = f
                    data.errors.forEach((i) => {
                        getError(field, i)
                    })
                })
            return Promise.reject(e)
        case 404:
            return history.push('/')
        default:
            if (ex.exType === ExType.ExError) {
                const exerr = ExErrors.find(
                    (e) => e.code === code && e.error === ex.error
                )
                if (!exerr) return
                Object.entries(errors.ex).forEach(([ex, method]) => {
                    if (exerr.error === ex) {
                        method()
                    }
                })
            }
            return Promise.reject(e)
    }
}
