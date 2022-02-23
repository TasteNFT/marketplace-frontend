import { FC, useMemo } from 'react'
import { TokenHistoryView } from '../../types/lot'
import { format } from '../../utils/moment'
import { Username } from '../profile/Profile'
import { dataFromOriginalTokenToCard } from '../OriginalTokens'
import { CardFile } from './Card/File'
import { Price } from './Price'
import { Link } from 'react-router-dom'
export const TokenHistoryColumn: FC<{ histories: TokenHistoryView[] }> = ({
    histories,
}) => {
    return (
        <div className="lot-list">
            <div className="lot-list__labels">
                <div className="lot-list__label">NFT</div>
                <div className="lot-list__label">Date</div>
                <div className="lot-list__label">From</div>
                <div className="lot-list__label">To</div>
                <div className="lot-list__label">Amount</div>
            </div>
            {histories.map((history) => (
                <TokenItemColumn
                    history={history}
                    key={history.id}
                ></TokenItemColumn>
            ))}
        </div>
    )
}

export const TokenItemColumn: FC<{ history: TokenHistoryView }> = ({
    history,
}) => {
    const cardFromOriginal = useMemo(
        () =>
            !!history.TokenOriginal &&
            dataFromOriginalTokenToCard(history.TokenOriginal),
        [history]
    )

    return (
        <div className="lot-list__item">
            <Link to={`/lot/${history.lotId}`} className="lot-list__label">
                <div className="lot-list__content">
                    {!!cardFromOriginal && (
                        <CardFile card={cardFromOriginal}></CardFile>
                    )}
                </div>
                <div className="lot-list__name">
                    {history.TokenOriginal?.name}
                </div>
            </Link>
            <div className="lot-list__label">{format(history.createdAt)}</div>
            <div className="lot-list__label">
                {!!history.UserOldOwner && (
                    <Username isLink user={history.UserOldOwner}></Username>
                )}
            </div>
            <div className="lot-list__label">
                {!!history.User && (
                    <Username isLink user={history.User}></Username>
                )}
            </div>
            <div className="lot-list__label">
                <Price wei={history.buyPrice || '0'}></Price>
            </div>
        </div>
    )
}
