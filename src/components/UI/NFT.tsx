import { useCallback, useEffect, useState } from 'react'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { ITokenNFTView } from '../../types/lot'
import { format } from '../../utils/moment'
import { Popup, PopupHalf, PopupHalfItem, PopupText } from '../../hoc/Popup'
import { floatFilter, InputWithState } from '../../components/UI/Input'
import { useRedirect } from '../../hooks/useRedirect'
import { useDispatch } from 'react-redux'
import { action_setLoading } from '../../store/actions/popup'
import { getTastePrice } from '../../utils/methods'
import { Margin } from '../../hoc/Margin'
import { Button } from './Buttons'
import { isDebug } from '../../utils/env'
import { Checkbox } from './Checkbox'
import { useRadio } from '../../hooks/useRadio'
import { errors } from '../../utils/notification'
import { createAuction, createSale } from '../../utils/signatures/sell'
import { SetTimer } from './Timer'

interface IPropsList {
    nftTokens: ITokenNFTView[]
    tokenOriginalId: string
}

export const NFTList = ({ nftTokens, tokenOriginalId }: IPropsList) => {
    //TEST FUNCTIONAL
    const [testContrVer, setTestContrVer] = useState('2')
    //TEST FUNCTIONAL

    const [picked, setPicked] = useState<ITokenNFTView[]>([])
    const [showCreateALot, setShowCreateALot] = useState(false)
    const [price, setPrice] = useState('0')

    const [expSec, setExpSec] = useState(0)
    const [expActive, setExpActive] = useState(false)

    const [priceInUSD, setPriceInUSD] = useState('0')

    const { auth } = useTypedSelector((s) => s)
    const redirect = useRedirect()
    const dispatch = useDispatch()

    type lotTypes = 'auction' | 'sale'

    const [type, setType] = useState<lotTypes>('auction')

    const lotType = useRadio<lotTypes>({
        value: [type, setType],
        indexes: ['auction', 'sale'],
    })

    const initPriceInUSD = useCallback(async () => {
        const getUsd = await getTastePrice
        setPriceInUSD(getUsd(price))
    }, [price])

    useEffect(() => {
        initPriceInUSD()
    }, [price, initPriceInUSD])
    useEffect(() => {
        setPicked([])
    }, [auth])

    function addOne(token: ITokenNFTView) {
        // if (token.userId !== auth.id && token.currentLotId) return

        const finded = picked.find((p) => p.id === token.id)
        let newData = [...picked]
        finded
            ? (newData = newData.filter((p) => p.id !== token.id))
            : newData.push(token)
        setPicked(newData)
    }

    function has(token: ITokenNFTView): boolean {
        return !!picked.filter((p) => p.id === token.id).length
    }

    async function createAlot() {
        if (lotType.mainState.auction) {
            if (expActive && expSec < 86400) {
                errors.minExpire()
                return
            }
        }

        dispatch(action_setLoading(true))
        try {
            const { data } = lotType.mainState.auction
                ? await createAuction({
                      picked,
                      price,
                      tokenOriginalId,
                      testContrVer,
                      expiresOffsetSec: expSec,
                  })
                : await createSale({
                      picked,
                      price,
                      tokenOriginalId,
                      testContrVer,
                  })
            redirect.toLot(data.id)
        } catch (e) {
            console.error(e)
        }
        dispatch(action_setLoading(false))
    }

    return (
        <div className="tokens">
            <div className="tokens__inner">
                {nftTokens.map((t, i) => (
                    <button
                        className={`token ${has(t) ? 'token--active' : ''}`}
                        disabled={t.userId !== auth.id || !!t.currentLotId}
                        onClick={() => addOne(t)}
                        key={t.id}
                    >
                        <div className="token__address">
                            {`Edition #${i + 1}. Owned by ${
                                t.User?.metamaskAddress
                            }`}
                        </div>
                        <div className="token__date">{format(t.createdAt)}</div>
                    </button>
                ))}
            </div>
            <Popup
                showState={[showCreateALot, setShowCreateALot]}
                title="List NFT for sale"
            >
                <>
                    <InputWithState
                        state={[price, setPrice]}
                        title={
                            lotType.mainState.auction
                                ? 'Enter the desired minimum price for this artwork'
                                : 'Enter the desired price for this artwork'
                        }
                        info={`(${priceInUSD}$)`}
                        filter={floatFilter}
                    ></InputWithState>
                    <PopupHalf>
                        <PopupHalfItem>
                            <Checkbox
                                state={[
                                    lotType.mainState.auction,
                                    () => lotType.setState('auction'),
                                ]}
                                title={'Auction'}
                            ></Checkbox>
                        </PopupHalfItem>
                        <PopupHalfItem>
                            <Checkbox
                                state={[
                                    lotType.mainState.sale,
                                    () => lotType.setState('sale'),
                                ]}
                                title={'Sale'}
                            ></Checkbox>
                        </PopupHalfItem>
                    </PopupHalf>

                    {lotType.mainState.auction ? (
                        <Checkbox
                            state={[expActive, setExpActive]}
                            title="Use timer"
                        ></Checkbox>
                    ) : null}
                    {expActive && lotType.mainState.auction ? (
                        <>
                            <PopupText text="Selling will end"></PopupText>
                            <SetTimer state={[expSec, setExpSec]}></SetTimer>
                        </>
                    ) : null}
                    {
                        isDebug ? (
                            <InputWithState
                                state={[testContrVer, setTestContrVer]}
                                title="Enter the contract version (TEST)"
                                filter={floatFilter}
                            ></InputWithState>
                        ) : null /*TEST FUNCTIONAL */
                    }

                    <Margin margin={{ top: 20 }}>
                        <Button onClick={createAlot}>List NFT for sale</Button>
                    </Margin>
                </>
            </Popup>
            {picked.length ? (
                <Button onClick={() => setShowCreateALot(true)}>
                    List NFT for sale
                </Button>
            ) : null}
        </div>
    )
}
