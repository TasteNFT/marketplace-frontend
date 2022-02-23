import { useCallback, useEffect, useState } from 'react'
import { ELotSaleType, ILot } from '../types/lot'
import { List } from '../components/Lots'
import { lot as lotAPI, user as userAPI } from '../utils/api/index'
import { IUser } from '../types/user'
import { UserList } from '../components/Users'
import { ISelectOption, Select } from '../components/UI/Select'
import { PageLoader } from '../components/Loader'
import { EventContext } from '../ctx/event'
import { TRow } from '../types/api'
import { NumPagination } from '../hoc/Pagination'
import { OGSetDescription, OGSetTitle, OGUpdateUrl } from '../utils/openGraph'
import { useTypedLocation } from '../hooks/useTypedLocation'
import _ from 'lodash'

export const Search = () => {
    const [loading, setLoading] = useState(false)
    const [row, setRow] = useState<TRow<ILot>>()
    const [lots, setLots] = useState<ILot[]>([])
    const [users, setUsers] = useState<IUser[]>([])
    const [page, setPage] = useState(1)
    const { location, scrollToFromLocation } = useTypedLocation()

    const sortOptions: ISelectOption<{
        desc: boolean
        orderBy:
            | 'lastActiveAt'
            | 'createdAt'
            | 'updatedAt'
            | 'currentCost'
            | 'expiresAt'
        hasATimeLimit?: '0' | '1'
    }>[] = [
        {
            label: 'Recently added',
            value: '1',
            meta: {
                desc: true,
                orderBy: 'createdAt',
            },
        },
        {
            label: 'Recently active',
            value: '4',
            meta: {
                desc: true,
                orderBy: 'lastActiveAt',
            },
        },
        {
            label: 'Highest price',
            value: '2',
            meta: {
                desc: true,
                orderBy: 'currentCost',
            },
        },
        {
            label: 'Lowest price',
            value: '3',
            meta: {
                desc: false,
                orderBy: 'currentCost',
            },
        },
        {
            label: 'Ending Soon',
            value: '5',
            meta: {
                desc: false,
                orderBy: 'expiresAt',
                hasATimeLimit: '1',
            },
        },
    ]

    const [sort, setSort] = useState(_.head(sortOptions))

    const salesTypeOptions: ISelectOption<{
        type: ELotSaleType | undefined
    }>[] = [
        {
            label: 'All',
            value: '1',
        },
        {
            label: 'Auctions',
            value: '2',
            meta: {
                type: ELotSaleType.AUCTION,
            },
        },
        {
            label: 'Sale',
            value: '3',
            meta: { type: ELotSaleType.SALE },
        },
    ]
    const [saleType, setSaleType] = useState(_.head(salesTypeOptions))

    const getLots = useCallback(async () => {
        setLoading(true)
        try {
            await lotAPI
                .get({
                    sortBy: sort?.meta?.orderBy,
                    sortDesc: sort?.meta?.desc,
                    search: location.state?.search,
                    saleType: saleType?.meta?.type,
                    page,
                    hasATimeLimit: sort?.meta?.hasATimeLimit,
                })
                .then(({ data }) => {
                    setRow(data)
                    setLots(data.rows)
                })
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }, [sort, location.state, saleType, page])

    useEffect(() => {
        scrollToFromLocation()
    }, [row, scrollToFromLocation])

    useEffect(() => {
        getLots()
    }, [sort, getLots])

    async function changeLot(lot: ILot) {
        const updatedLots = lots.map((l) => (l.id === lot.id ? lot : l))
        setLots(updatedLots)
    }

    function removeLot(id: string) {
        setLots(lots.filter((l) => l.id !== id))
    }

    useEffect(() => {
        OGSetTitle('Search | TasteNFT')
        OGSetDescription(
            'The NFT marketplace for sensual digital artwork empowering creators of exclusive fine nude and body art'
        )
        OGUpdateUrl()
        userAPI
            .get({ name: location.state?.search })
            .then(({ data }) => setUsers(data.rows))
    }, [location.state])

    return (
        <>
            <EventContext.Provider
                value={{
                    onPaginationPage: setPage,
                    onTimerEnd: removeLot,
                    onTimerUpdated: changeLot,
                }}
            >
                {loading ? <PageLoader></PageLoader> : null}
                <div className="selects">
                    <div className="selects__item">
                        <Select
                            name="sort"
                            onChange={setSort}
                            options={sortOptions}
                        ></Select>
                    </div>
                    <div className="selects__item">
                        <Select
                            name="saleType"
                            onChange={setSaleType}
                            options={salesTypeOptions}
                        ></Select>
                    </div>
                </div>
                <List lots={lots}></List>
                {row ? <NumPagination row={row}></NumPagination> : null}

                {!loading && !row?.rows.length ? (
                    <div className="empty">Nothing here yet</div>
                ) : null}
                {users ? (
                    <UserList users={users} title="Creators"></UserList>
                ) : null}
            </EventContext.Provider>
        </>
    )
}
