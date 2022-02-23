import { ReactNode, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ECardType, ICard } from '../../../types/card'
import {
    getStatus,
    getUserAvatar,
    getUserLink,
    getUserName,
} from '../../../utils/methods'
import { hideToken, removeToken } from '../../../utils/lot'
import { Username } from '../../profile/Profile'
import { Popup } from '../../../hoc/Popup'
import { useContext } from 'react'
import { EventContext } from '../../../ctx/event'
import { CardFile } from './File'
import { Editor } from './Editor'
import { useTimer } from '../../../hooks/useTimer'
import { UpdateTimer } from '../Timer'
import { useCardMeta } from '../../../hooks/useCardMeta'
import { Price } from '../Price'
import { RecordYOffsetLink } from '../../../hoc/RecordYOffset'
import classNames from 'classnames'

export const Cards = ({ cards }: { cards: ICard[] }) => {
    return (
        <div className="lots">
            {cards.map((c) => (
                <Card card={c} key={c.id}></Card>
            ))}
        </div>
    )
}
export function CardActions({ children }: { children: ReactNode }) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="lot-widget__points">
            <div
                className="lot-widget__item"
                onClick={() => setShowMenu(!showMenu)}
            >
                <i className="fas fa-ellipsis-v"></i>
            </div>
            <div
                className={classNames('lot-widget__menu', {
                    'ot-widget__menu-show': showMenu,
                })}
            >
                {children}
            </div>
        </div>
    )
}

export function CardAction({
    children,
    onClick,
    color,
}: {
    children: ReactNode
    onClick?: React.MouseEventHandler<HTMLDivElement>
    color?: 'green' | 'red'
}) {
    const className = classNames(
        'lot-widget__item',
        color ? `lot-widget__item-${color}` : ''
    )
    return (
        <div className={className} onClick={onClick}>
            {children}
        </div>
    )
}

export const Card = ({ card }: { card: ICard }) => {
    const [showEditor, setShowEditor] = useState(false)
    const [showNewTimer, setShowNewTimer] = useState(false)
    const { onCardRemove, onCardHided } = useContext(EventContext)
    const timerResult = useTimer(card.expired, card.id)
    const { isAuthor, canSetNewTimer, isDraft, showSettings, canHide } =
        useCardMeta(card)

    const link = useMemo(() => {
        switch (card.cardType) {
            case ECardType.lot:
                return `/lot/${card.id}`
            case ECardType.originalToken:
                return `/original-token/${card.id}`
        }
    }, [card])

    async function remove() {
        await removeToken(card.id)
        if (onCardRemove) onCardRemove(card.id)
    }
    async function hide() {
        await hideToken(card.id)
        if (onCardHided) onCardHided(card.id)
    }

    return (
        <div className="lot">
            <div className="lot-widget">
                {!isAuthor && card.User ? (
                    <Link to={getUserLink(card.User)}>
                        <div className="lot-widget-user">
                            <div className="lot-widget-user__avatar">
                                <img
                                    src={getUserAvatar(card.User.avatar, true)}
                                    alt="avatar"
                                />
                            </div>
                            <div className="lot-widget-user__info">
                                <div className="lot-widget-user__name">
                                    {getUserName(card.User)}
                                </div>
                                <Username
                                    user={card.User}
                                    className="lot-widget-user__username"
                                ></Username>
                                {/* <div className="lot-widget-user__username">
                                    @{card.User.metaName || ''}
                                </div> */}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <>
                        <div
                            className="lot-widget__status"
                            style={{ color: getStatus(card.status).color }}
                        >
                            {getStatus(card.status).text}
                        </div>
                    </>
                )}

                {showSettings ? (
                    <CardActions>
                        <CardAction
                            onClick={() => setShowEditor(true)}
                            color="green"
                        >
                            <i className="fas fa-pencil-alt"></i>
                        </CardAction>
                        <CardAction onClick={remove} color="red">
                            <i className="fas fa-trash"></i>
                        </CardAction>
                    </CardActions>
                ) : null}
                {canHide ? (
                    <CardActions>
                        <CardAction onClick={hide}>
                            <i className="fas fa-eye-slash"></i>
                        </CardAction>
                    </CardActions>
                ) : null}
                {canSetNewTimer ? (
                    <CardActions>
                        <CardAction
                            color="green"
                            onClick={() => setShowNewTimer(true)}
                        >
                            <i className="fas fa-stopwatch-20"></i>
                        </CardAction>
                    </CardActions>
                ) : null}
            </div>
            <RecordYOffsetLink to={link}>
                <div
                    className="lot__image"
                    data-alert={
                        card.moderatorMessage && isDraft
                            ? 'Has comment from moderator'
                            : null
                    }
                >
                    <CardFile card={card}></CardFile>
                </div>
                <div className="lot__title">{card.name}</div>
            </RecordYOffsetLink>
            {card.currentCost ? (
                <div className="lot-info">
                    <div className="lot-info__title">Selling for:</div>
                    <Price
                        wei={card.currentCost}
                        className="lot-info__data"
                    ></Price>
                </div>
            ) : null}
            {timerResult ? (
                <div className="lot-info">
                    <div className="lot-info__title">Ending in:</div>
                    <div className="lot-info__data">
                        <span>{timerResult}</span>
                    </div>
                </div>
            ) : null}
            {isAuthor && isDraft ? (
                <Popup showState={[showEditor, setShowEditor]} title="Edit NFT">
                    <Editor card={card}></Editor>
                </Popup>
            ) : null}
            {isAuthor ? (
                <UpdateTimer
                    state={[showNewTimer, setShowNewTimer]}
                    lotId={card.id}
                    expiresAt={card.expired}
                ></UpdateTimer>
            ) : null}
        </div>
    )
}
