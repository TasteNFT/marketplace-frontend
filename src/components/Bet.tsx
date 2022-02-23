import { useCallback, useEffect, useState } from 'react'
import { getTastePrice } from '../utils/methods'
import { errors } from '../utils/notification'
import { floatFilter, InputWithState } from './UI/Input'
import { Popup } from '../hoc/Popup'
import { action_setLoading } from '../store/actions/popup'
import { fromWeiToString } from '../utils/wallet/utils'
import { useDispatch } from 'react-redux'
import { ICard } from '../types/card'
import { useContext } from 'react'
import { EventContext } from '../ctx/event'
import { Margin } from '../hoc/Margin'
import { Button } from './UI/Buttons'
import { lotPlaceABet } from '../utils/signatures/buy'

interface IProps {
    show: [boolean, (state: boolean) => void]
    card: ICard
}

export const PlaceABet = ({ show, card }: IProps) => {
    const [betAmount, setBetAmount] = useState('0')
    const [minBetAmount, setMinBetAmount] = useState('0')
    const [betAmountInUsd, setBetAmountInUsd] = useState('0')
    const [showPlaceABid, setShowPlaceABid] = show
    const dispatch = useDispatch()
    const { onBet } = useContext(EventContext)

    const init = useCallback(() => {
        const res = fromWeiToString(card?.currentCost || '0')
        const amount = (+res + +res * 0.05).toFixed(6)
        const computed = +amount === 0 ? '0.000001' : amount
        setBetAmount(computed)
        setMinBetAmount(computed)
    }, [card])

    const initBetAmountInUSD = useCallback(async () => {
        const getUsd = await getTastePrice
        setBetAmountInUsd(getUsd(betAmount))
    }, [betAmount])

    useEffect(() => {
        init()
    }, [init])
    useEffect(() => {
        initBetAmountInUSD()
    }, [initBetAmountInUSD])

    async function placeABet() {
        dispatch(action_setLoading(true))
        if (+minBetAmount > +betAmount) {
            errors.bidIsLessThanMin()
            dispatch(action_setLoading(false))
            return Promise.reject()
        }
        try {
            await lotPlaceABet(card, betAmount, card.marketplaceVer)
            if (onBet) onBet()
            setShowPlaceABid(false)
        } catch (e) {
            console.error(e)
            errors.actionCanceled()
        }
        dispatch(action_setLoading(false))
    }

    return (
        <Popup
            showState={[showPlaceABid, setShowPlaceABid]}
            title="Place a bid"
        >
            <>
                <InputWithState
                    state={[betAmount, setBetAmount]}
                    title="Enter the desired amount of your bid. It must be 5% higher than the previous bid. You may cancel your bid 24 hours after placing."
                    helper="TASTE"
                    info={`(${betAmountInUsd}$)`}
                    filter={floatFilter}
                ></InputWithState>
                <Margin margin={{ top: 20 }}>
                    <Button fill onClick={placeABet}>
                        Place
                    </Button>
                </Margin>
            </>
        </Popup>
    )
}
