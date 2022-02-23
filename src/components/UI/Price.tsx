import { useCallback, useMemo } from 'react'
import { useEffect, useState } from 'react'
import { img } from '../../assets/assets'
import { getTastePrice, reduction } from '../../utils/methods'
import { fromWeiToString } from '../../utils/wallet/utils'

interface PriceProps {
    wei: string
    className?: string
}
export function Price({ wei, className }: PriceProps) {
    const [usd, setUsd] = useState('')
    const price = useMemo(() => reduction(fromWeiToString(wei)), [wei])

    const initUsd = useCallback(async () => {
        const getUsd = await getTastePrice
        setUsd(getUsd(fromWeiToString(wei)))
    }, [wei])
    useEffect(() => {
        initUsd()
    }, [wei, initUsd])

    return (
        <div className={`price ${className || ''}`}>
            <div className="price__logo">
                <img src={img.lotSoldIcon} alt="" />
            </div>
            <div className="price__cost">{price}</div>
            {usd.length ? <div className="price__usd">({usd}$)</div> : null}
        </div>
    )
}
