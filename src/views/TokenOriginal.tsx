import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { originalToken as originTokenAPI } from '../utils/api/index'
import { ITokenOriginalView } from '../types/lot'
import { Detail } from '../components/OriginalTokens'
import { List } from '../components/Lots'
import { useMemo } from 'react'
import { EventContext } from '../ctx/event'
import {
    OGSetDescription,
    OGSetImage,
    OGSetTitle,
    OGTitleHelper,
    OGUpdateUrl,
} from '../utils/openGraph'

export const TokenDetail = () => {
    const [token, setToken] = useState<ITokenOriginalView>()
    const { id } = useParams<{ id: string }>()

    const getALot = () => {
        originTokenAPI.id(id).then(({ data }) => {
            setToken(data)
            OGSetTitle(OGTitleHelper(data.name || ''))
            OGSetDescription(data.description || '')
            OGSetImage(data.TokenMedias?.find(() => true)?.sha256 || '')
            OGUpdateUrl()
        })
    }

    useEffect(getALot, [id])

    const lotsCard = useMemo(
        () =>
            token?.Lots?.map((l) => ({
                ...l,
                TokenOriginal: token,
            })) || [],
        [token]
    )

    return (
        <EventContext.Provider value={{ onCardUpdated: getALot }}>
            {token ? (
                <>
                    <Detail token={token}></Detail>
                    {lotsCard?.length ? <List lots={lotsCard}></List> : null}
                </>
            ) : null}
        </EventContext.Provider>
    )
}
