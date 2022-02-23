import toastr from 'toastr'
import { Errors } from '../types/api'

const config: ToastrOptions = {
    positionClass: 'toast-bottom-left',
}

export function success(msg: string, title?: string) {
    return toastr.success(msg, title, config)
}

export function error(msg: string, title?: string) {
    return toastr.error(msg, title, config)
}

export const errors = {
    sendFile() {
        error(
            'Video file must match following requirements: min. frame rate - 24 , maximum duration - 3 minutes, min resolution - 200x200px, max. size - 100mb. Image file must match following requirements: min resolution - 200x200px, max. size - 100mb.'
        )
    },
    fileIsBig() {
        error('File size exceeds allowed size. Max size is 15 mb.')
    },
    badMimeType() {
        error('Bad mime type')
    },
    pickTheFile() {
        error('Pick the file.')
    },
    fillRequireFields() {
        error('Fill in the required fields.')
    },
    bidIsLessThanMin() {
        error('Your bid is less than minimum required amount.')
    },
    actionCanceled() {
        error('Action canceled')
    },
    fieldsHaveErrors() {
        error('Fields have errors')
    },
    invalidFileExtension() {
        error('Invalid file extension')
    },
    changeToBsc() {
        error('You have to change your network to BSC')
    },
    needMetamask() {
        error(`You don't have a metamask!`)
    },
    emailIsUsed() {
        error('This E-mail is used')
    },
    metaNameIsUsed() {
        error('This username is used')
    },
    fullscreen() {
        error("Fullscreen doesn't have a permission in your browser")
    },
    fillExpire() {
        error('Enter the full date')
    },
    minExpire() {
        error('The minimum value is 24 hours')
    },
    smallBalance() {
        error('Insufficient balance')
    },
    userIsntGuest() {
        error("User isn't guest")
    },
    userIsntUser() {
        error("User isn't user")
    },
    ex: {
        [Errors.common_unauthorized]: () => error('Unauthorized request'),
        [Errors.common_forbidden]: () => error('Forbidden request'),
        [Errors.common_request_timeout]: () => error('Request timeout expired'),
        [Errors.common_payload_too_large]: () =>
            error('Sent data is too large'),
        [Errors.file_bad_mime_type]: () => error('Incorrect file type'),
        [Errors.user_bad_passwort_reset_code]: () =>
            error('Incorrect reset code'),
        [Errors.user_role_isnt_user]: () =>
            error('You must be authorized to perform this action'),
        [Errors.user_role_isnt_guest]: () =>
            error('You must be unauthorized to perform this action'),
        [Errors.lot_isnt_sale_type]: () => error('Lot type is not "Buy"'),
        [Errors.lot_isnt_auction_type]: () =>
            error('Lot type is not "Auction"'),
        [Errors.lot_isnt_sale_status]: () => error('Lot is not for sale'),
        [Errors.lot_token_not_available_for_buy]: () =>
            error('Token is not for sale'),
        [Errors.lot_bet_isnt_top_bet]: () =>
            error('Bet is not at top of this lot'),
        [Errors.lot_bet_low_delay_before_bet_cancel]: () =>
            error('Unable to cancel bet: more time must elapse'),
        [Errors.lot_bet_bet_user_is_equal_lot_user]: () =>
            error("You can't bid in this lot"),
        [Errors.token_original_status_isnt_validation]: () =>
            error('Token is not on validation'),
        [Errors.token_original_status_isnt_draft]: () =>
            error('Token is not a draft'),
        [Errors.token_original_status_isnt_ban_or_draft]: () =>
            error('Token is not a draft and not banned'),
        [Errors.token_original_max_10_orgs_in_process]: () =>
            error(
                'Please wait until the import is finished: maximum 10 imports in a row'
            ),
        [Errors.token_original_contents_not_load]: () =>
            error('Metadata is not available'),
        [Errors.token_original_bad_file_content_type]: () =>
            error('Incorrect file type'),
        [Errors.token_original_import_faild_load_meta_data]: () =>
            error('Metadata is not available'),
        [Errors.token_original_import_image_url_not_math]: () =>
            error('Image URL is not found in metadata'),
        [Errors.token_original_nft_isnt_approved]: () =>
            error('NFT is not approved'),
        [Errors.web3_smallBalance]: () =>
            error('You have insufficient funds to perform this action'),
        [Errors.web3_smallApproval]: () =>
            error('You have insufficient approval to perform this action'),
        [Errors.metamask_bad_message]: () => error('Incorrect message'),
        [Errors.metamask_user_is_exist]: () =>
            error('Such user is already exists'),
    },
}

export const notifications = {
    NFTSendToModeration() {
        success('Your NFT successfully sent to moderation')
    },
    copied() {
        success('Copied!')
    },
    authMessageSended() {
        success('The message sended to your device')
    },
    bought() {
        success('Bought!')
    },
}
