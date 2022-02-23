import { useEffect, useMemo, useState } from 'react'
import { useTypedSelector } from '../../../hooks/useTypedSelector'
import { ECardType, ICard } from '../../../types/card'
import { TokenHistoryView } from '../../../types/lot'
import { lot as lotAPI } from '../../../utils/api/index'
import { Activities } from '../../Activities'
import { NFTList } from '../NFT'
import { createRef } from 'react'
import { PlaceABet } from '../../Bet'
import { useContext } from 'react'
import { EventContext } from '../../../ctx/event'
import { Button } from '../Buttons'
import { CardFile } from './File'
import { CardInfo } from './Info'
import { errors, notifications } from '../../../utils/notification'
import { useTimer } from '../../../hooks/useTimer'
import { buyALot } from '../../../utils/signatures/buy'
import { PageLoader } from '../../Loader'
import { useCardMeta } from '../../../hooks/useCardMeta'
import { useCardContent } from '../../../hooks/useCardContent'
import { Price } from '../Price'

interface IPropsCardDetail {
    card: ICard
    activities?: TokenHistoryView[]
}

export const CardDetail = ({ card, activities }: IPropsCardDetail) => {
    const { auth } = useTypedSelector((store) => store)

    const [lastBetAmount] = useState(card.currentCost)
    const [showPlaceABid, setShowPlaceABid] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [loading, setLoading] = useState(false)
    let fullscreenRef = createRef<HTMLVideoElement & HTMLImageElement>()
    const { onCardUpdated, onBet, onLotBuy } = useContext(EventContext)

    const { isAuthor, isAuction, inSales, canBetCancel } = useCardMeta(card)
    const content = useCardContent(card)

    useEffect(() => {
        document.addEventListener('fullscreenchange', handlerFullscreenChande)
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handlerFullscreenChande
            )
        }
    }, [])

    const timer = useTimer(card.expired, card)

    const showFullscreenBtn = useMemo(
        () => document.fullscreenEnabled && !!content,
        [content]
    )

    function toggleFS() {
        if (!document.fullscreenEnabled) {
            errors.fullscreen()
            return
        }
        if (!document.fullscreenElement) {
            fullscreenRef.current?.requestFullscreen()
            return
        }
        document.exitFullscreen()
    }
    function handlerFullscreenChande() {
        setFullscreen(!!document.fullscreenElement)
    }

    async function finish() {
        await lotAPI.finishAuction({ lotId: card.id })
        if (onCardUpdated) onCardUpdated()
    }

    async function cancelBet() {
        if (!card.LastBet?.id) {
            return
        }
        await lotAPI.cancelABet({ lotBetId: card.LastBet.id })
        if (onBet) onBet()
    }

    async function buyToken() {
        const token = card.LotTokens?.find((t) => !t.isSold)
        if (!token || !token.TokenNFT) {
            return
        }
        setLoading(true)
        try {
            await buyALot(card.id, card.currentCost || '0', token.TokenNFT)
            notifications.bought()
            if (onLotBuy) onLotBuy()
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    return (
        <>
            {loading ? <PageLoader></PageLoader> : null}
            <section className="mainframe">
                <div className="mainframe__body" ref={fullscreenRef}>
                    <div
                        className={`mainframe__file ${
                            fullscreen ? 'mainframe__file-fullscreen' : ''
                        } ${
                            !showFullscreenBtn ? 'mainframe__file-opened' : ''
                        }`}
                    >
                        <CardFile card={card}></CardFile>
                        {showFullscreenBtn ? (
                            <div
                                className="mainframe__fullbtn"
                                onClick={toggleFS}
                            >
                                {fullscreen ? (
                                    <i className="fas fa-compress-arrows-alt"></i>
                                ) : (
                                    <i className="fas fa-expand-arrows-alt"></i>
                                )}
                            </div>
                        ) : null}
                    </div>
                    {inSales ? (
                        <div className="mainframe__bid bid">
                            <div className="bid__item">
                                <div className="bid__item-title">
                                    Min. bid required:
                                </div>
                                {lastBetAmount && (
                                    <Price
                                        wei={lastBetAmount}
                                        className="bid__item-content"
                                    ></Price>
                                )}
                            </div>
                            {timer && isAuction ? (
                                <div className="bid__item">
                                    <div className="bid__item-title">
                                        Auction ends:
                                    </div>
                                    <div className="bid__item-content">
                                        <p>{timer}</p>
                                    </div>
                                </div>
                            ) : null}
                            {!!auth.id ? (
                                isAuction ? (
                                    isAuthor ? (
                                        <div className="bid__item">
                                            <Button onClick={finish} fill>
                                                Finish Auction
                                            </Button>
                                        </div>
                                    ) : canBetCancel ? (
                                        <div className="bid__item">
                                            <Button onClick={cancelBet} fill>
                                                Cancel a bid
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bid__item">
                                            <Button
                                                onClick={() =>
                                                    setShowPlaceABid(true)
                                                }
                                                fill
                                            >
                                                Place a bid
                                            </Button>
                                        </div>
                                    )
                                ) : isAuthor ? (
                                    <div className="bid__item">
                                        <Button onClick={finish} fill>
                                            Cancel the sale
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bid__item">
                                        <Button onClick={buyToken} fill>
                                            Buy
                                        </Button>
                                    </div>
                                )
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </section>
            <CardInfo card={card}>
                {card.cardType === ECardType.lot ? (
                    <Activities activities={activities}></Activities>
                ) : card.TokensNFT?.length ? (
                    <NFTList
                        nftTokens={card.TokensNFT}
                        tokenOriginalId={card.id}
                    ></NFTList>
                ) : null}
            </CardInfo>
            <PlaceABet
                card={card}
                show={[showPlaceABid, setShowPlaceABid]}
            ></PlaceABet>
        </>
    )
}
