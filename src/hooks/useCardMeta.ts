import { useMemo } from 'react'
import { ECardType, ICard } from '../types/card'
import { ELotSaleType, ELotStatus, ETokenOriginalStatus } from '../types/lot'
import { differenceHours } from '../utils/moment'
import { useTypedSelector } from './useTypedSelector'

export function useCardMeta(card: ICard) {
    const { auth } = useTypedSelector((s) => s)
    const isLot = useMemo(() => card.cardType === ECardType.lot, [card])
    const isOriginalToken = useMemo(
        () => card.cardType === ECardType.originalToken,
        [card]
    )
    const inSales = useMemo(() => card.status === ELotStatus.IN_SALES, [card])
    const isAuthor = useMemo(() => card.User?.id === auth.id, [auth, card])
    const isAuction = useMemo(
        () => card.saleType === ELotSaleType.AUCTION,
        [card]
    )
    const isDraft = useMemo(
        () => card.status === ETokenOriginalStatus.DRAFT,
        [card]
    )
    const isBan = useMemo(
        () => card.status === ETokenOriginalStatus.BAN,
        [card]
    )
    const moderated = useMemo(
        () => card.status === ETokenOriginalStatus.PUBLISHED,
        [card]
    )
    const showSettings = useMemo(() => isAuthor && isDraft, [isAuthor, isDraft])

    const canHide = useMemo(
        () => isAuthor && !card.Lots?.length && !isDraft && moderated,
        [isAuthor, isDraft, moderated, card]
    )

    const canSetNewTimer = useMemo(
        () => isAuthor && isLot && inSales && isAuction,
        [isAuthor, inSales, isLot, isAuction]
    )
    const showShareBtn = useMemo(() => {
        return !(
            isDraft ||
            card.status === ETokenOriginalStatus.VALIDATION ||
            card.status === ETokenOriginalStatus.TASK
        )
    }, [card, isDraft])
    const userHasLastBet = useMemo(
        () => card.LastBet?.userId === auth.id,
        [card, auth]
    )
    const canBetCancel = useMemo(() => {
        return userHasLastBet && differenceHours(card.LastBet?.createdAt) >= 24
    }, [card, userHasLastBet])

    return {
        isLot,
        inSales,
        isAuction,
        isAuthor,
        isDraft,
        moderated,
        canSetNewTimer,
        isBan,
        isOriginalToken,
        showShareBtn,
        userHasLastBet,
        canBetCancel,
        showSettings,
        canHide,
    }
}
