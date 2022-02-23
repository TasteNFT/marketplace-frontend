import { useParams } from 'react-router'
import { useCallback, useEffect, useState } from 'react'
import {
    lot as lotAPI,
    originalToken as originalTokenAPI,
} from '../utils/api/index'
import { ELotStatus, ILot, TokenHistoryView } from '../types/lot'
import { Detail } from '../components/Lots'
import { EventContext } from '../ctx/event'
import {
    OGSetDescription,
    OGSetImage,
    OGSetTitle,
    OGTitleHelper,
    OGUpdateUrl,
} from '../utils/openGraph'
import { useRedirect } from '../hooks/useRedirect'

export const LotDetail = () => {
    const [lot, setLot] = useState<ILot>()
    const [activities, setActivities] = useState<TokenHistoryView[]>()
    const { id } = useParams<{ id: string }>()

    const getALot = useCallback(() => {
        async function getData() {
            originalTokenAPI
                .history({
                    lotId: id,
                    sortBy: 'id',
                    sortDesc: true,
                })
                .then(({ data }) => setActivities(data.rows))
            lotAPI.id(id).then((res) => {
                const { data } = res

                setLot(data)
                OGSetTitle(OGTitleHelper(data.TokenOriginal?.name || ''))
                OGSetDescription(data.TokenOriginal?.description || '')
                OGSetImage(
                    data.TokenOriginal?.TokenMedias?.find(() => true)?.sha256 ||
                        ''
                )
                OGUpdateUrl()
                return res
            })
        }

        getData()
    }, [id])

    useEffect(() => {
        getALot()
    }, [getALot])
    const redirect = useRedirect()

    function onLotBuy() {
        if (!lot) return
        if (lot.LotTokens?.filter((t) => !t.isSold).length) {
            setLot({
                ...lot,
                status: ELotStatus.CLOSED,
            })
        }
    }
    return (
        <EventContext.Provider
            value={{
                onCardUpdated: getALot,
                onBet: getALot,
                onLotBuy,
                onTimerDetailEnd: () => redirect.toIndex(),
                onTimerUpdated: (lot) => setLot(lot),
            }}
        >
            <>
                {lot ? (
                    <Detail lot={lot} activities={activities}></Detail>
                ) : null}
            </>
        </EventContext.Provider>
    )
}
