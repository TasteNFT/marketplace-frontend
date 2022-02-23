import { useCallback, useMemo } from 'react'
import { useEffect, useState } from 'react'
import { img } from '../assets/assets'
import { TokenHistoryType, TokenHistoryView } from '../types/lot'
import { fromWeiToString } from '../utils/wallet/utils'
import { getTastePrice, getUserAvatar, reduction } from '../utils/methods'
import { format } from '../utils/moment'

export const Activity = ({ activity }: { activity: TokenHistoryView }) => {
    const [usdPrice, setUsdPrice] = useState('0')
    const price = useMemo(() => {
        switch (activity.type) {
            case TokenHistoryType.LOT_CREATED:
                return activity.Lot?.minimalCost || null
            case TokenHistoryType.NFT_TOKEN_ADDED:
                return null
            case TokenHistoryType.NFT_TOKEN_PUT_UP_FOR_SALE:
                return activity.Lot?.minimalCost || null
            default:
                return activity.Bet?.betAmount || null
        }
    }, [activity])
    const title = useMemo(() => {
        switch (activity.type) {
            case TokenHistoryType.LOT_CREATED:
                return `NFT listed by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.ORG_PUBLISHED:
                return `Artwork published by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.LOT_CLOSED:
                return `Lot closed ${
                    activity.User?.metamaskAddress
                        ? `by ${activity.User?.metamaskAddress}`
                        : ''
                }`
            case TokenHistoryType.NFT_TOKEN_ADDED:
                return `NFT minted by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.NFT_TOKEN_CHANGED_OWNER_BET:
                return `NFT bought by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.NFT_TOKEN_PUT_UP_FOR_SALE:
                return `NFT up for sale by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.NFT_TOKEN_CHANGED_OWNER_SALE:
                return `NFT bought by  ${activity.User?.metamaskAddress}`
            case TokenHistoryType.LOT_BET_CREATED:
                return `Bid placed by ${activity.User?.metamaskAddress}`
            case TokenHistoryType.LOT_BET_CANCEL:
                return `Bid canceled by ${activity.User?.metamaskAddress}`

            default:
                return activity.User?.metamaskAddress
        }
    }, [activity])

    const init = useCallback(async () => {
        const toUsd = await getTastePrice
        setUsdPrice(toUsd(fromWeiToString(price || '0')))
    }, [price])
    useEffect(() => {
        init()
    }, [init])

    return (
        <div className="activity">
            <div className="activity__avatar">
                <img src={getUserAvatar(activity.User?.avatar)} alt="avatar" />
            </div>

            <div className="activity__info">
                <div className="activity__from">{title}</div>

                <div className="activity__date">
                    {format(activity.updatedAt)}
                </div>
            </div>

            {price ? (
                <div className="activity__sold">
                    <div className="activity__logo">
                        <img src={img.lotSoldIcon} alt="like" />
                    </div>
                    <div className="activity__bid">
                        {reduction(fromWeiToString(price || '0'))}
                    </div>
                    <div className="activity__usd">({usdPrice}$)</div>
                </div>
            ) : null}

            {/* <div className="btn">
                            <img src={img.activityLink} alt="link" />
                        </div> */}
        </div>
    )
}

export function Activities({
    activities,
}: {
    activities?: TokenHistoryView[]
}) {
    return activities?.length ? (
        <div className="activities">
            <div className="activities__title">Activity</div>
            <div className="activities__content">
                {activities.map((activity) => (
                    <Activity activity={activity} key={activity.id}></Activity>
                ))}
            </div>
        </div>
    ) : (
        <div className="activity">
            <div className="activity__body">
                <div className="activity__title">No activity</div>
            </div>
        </div>
    )
}
