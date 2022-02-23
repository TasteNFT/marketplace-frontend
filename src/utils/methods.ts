import { img } from '../assets/assets'
import { ELotStatus, ETokenOriginalStatus } from '../types/lot'
import { IUser } from '../types/user'
import { coinsbit, pancakeswap } from './api'

export const scroll = {
    enable() {
        document.body.classList.remove('hidden')
    },
    disable() {
        document.body.classList.add('hidden')
    },
}

export function getUserAvatar(
    sha256: string | undefined | null,
    dark?: boolean
) {
    return sha256 ? `/sha256/${sha256}` : dark ? img.avatarDark : img.avatar
}

export function getUserName(user: IUser) {
    return user.name || user.metaName || user.metamaskAddress
}

export function getImgLink(sha256: string) {
    return `/sha256/${sha256}`
}

export function getUserLink(user: IUser) {
    return `/user/${user.metaName ? `@${user.metaName}` : user.id}`
    // return `/user/${user.id}`
}

export const getTastePrice = (async function () {
    const { data } = await pancakeswap.getPrice().catch(() => ({
        data: {
            updated_at: '',
            data: {
                name: '',
                symbol: '',
                price: '0',
                price_BNB: '0',
            },
        },
    }))

    let k = +data.data.price

    if (k <= 0) {
        const { data } = await coinsbit.getPrice()
        k = data.rate
    }

    return (amount: string) => {
        // console.log(+amount * k)
        const res = +(+amount * k).toFixed(12)
        return res < 0.01 ? `<0.01` : res.toFixed(2)
    }
})()

export function sharePage() {
    return navigator.share({
        title: document.title,
        text: 'Hello World',
        url: window.location.href,
    })
}

export function copyToClipboard(text: string) {
    const input = document.createElement('textarea')
    input.style.position = 'fixed'
    input.style.zIndex = '-1'
    document.body.append(input)
    input.value = text
    input.select()
    document.execCommand('copy')
    input.remove()
}

export function reduction(num: string) {
    const k = +num / 1000
    const m = +num / 1_000_000
    const b = +num / 1_000_000_000
    const t = +num / 1_000_000_000_000

    const round = (n: number) => {
        return (Math.round(n * 100) / 100).toFixed(2)
    }

    if (t >= 1) {
        return `${round(t)}T`
    }
    if (b >= 1) {
        return `${round(b)}B`
    }
    if (m >= 1) {
        return `${round(m)}M`
    }
    if (k >= 1) {
        return `${round(k)}K`
    }

    return round(+num)
}

export function getStatus(
    status: ELotStatus | ETokenOriginalStatus | undefined
): { text: string; color: string } {
    switch (status) {
        case ETokenOriginalStatus.DRAFT:
            return { text: 'Draft', color: '#ffa500' }
        case ETokenOriginalStatus.IMPORT_TASK:
            return { text: 'Importing', color: '#ffa500' }
        case ELotStatus.CLOSED:
            return { text: 'Closed', color: '#b6b6b6' }
        case ETokenOriginalStatus.BAN:
            return { text: 'Ban', color: '#ff0000' }
        case ELotStatus.IN_SALES:
            return { text: 'For sale', color: '#03be00' }
        case ETokenOriginalStatus.VALIDATION:
            return { text: 'Approving', color: '#8743FF' }
        case ETokenOriginalStatus.TASK:
            return { text: 'Approving', color: '#8743FF' }
        case ETokenOriginalStatus.PUBLISHED:
            return { text: 'Published', color: '#03be00' }
        default:
            return { text: 'Draft', color: 'black' }
    }
}
