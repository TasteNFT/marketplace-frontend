import { toWei, fromWei } from 'web3-utils'

export function fromStringToWei(num: string) {
    return toWei(num, 'nano')
}
export function fromWeiToString(num: string) {
    return fromWei(num, 'nano')
}
