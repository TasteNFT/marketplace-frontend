import { useCallback, useEffect, useState } from 'react'
import { ILot } from '../types/lot'
import { List } from '../components/Lots'
import { lot as lotAPI, user as userAPI } from '../utils/api/index'
import { IUser } from '../types/user'
import { UserList } from '../components/Users'
import { ISelectOption, Select } from '../components/UI/Select'
import { PageLoader } from '../components/Loader'
import { EventContext } from '../ctx/event'
import { TRow } from '../types/api'
import { TopLotsCarousel } from '../components/Carousel'
import { OGSetDescription, OGSetTitle, OGUpdateUrl } from '../utils/openGraph'
import { Button } from '../components/UI/Buttons'
import { Link } from 'react-router-dom'
import { useTypedLocation } from '../hooks/useTypedLocation'
import _ from 'lodash'

export const Index = () => {
    const [loading, setLoading] = useState(false)
    const [row, setRow] = useState<TRow<ILot>>()
    const [lots, setLots] = useState<ILot[]>([])
    const [top, setTop] = useState<ILot[]>([])
    const [users, setUsers] = useState<IUser[]>([])
    const [page, setPage] = useState(1)
    const { scrollToFromLocation } = useTypedLocation()

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

    const getLots = useCallback(async () => {
        setLoading(true)
        try {
            await lotAPI
                .get({
                    sortBy: sort?.meta?.orderBy,
                    sortDesc: sort?.meta?.desc,
                    hasATimeLimit: sort?.meta?.hasATimeLimit,
                })
                .then(({ data }) => {
                    setRow(data)
                    setLots(data.rows)
                })
        } catch (e) {
            console.error(e)
        }
        scrollToFromLocation()
        setLoading(false)
    }, [sort, scrollToFromLocation])

    useEffect(() => {
        setPage(1)
        getLots()
    }, [sort, getLots])

    const getTop = useCallback(async () => {
        await lotAPI.top().then(({ data }) => setTop(data))
        scrollToFromLocation()
    }, [scrollToFromLocation])

    async function addLots() {
        setPage(page + 1)
        await lotAPI
            .get({
                sortBy: sort?.meta?.orderBy,
                sortDesc: sort?.meta?.desc,
                page: page + 1,
            })
            .then(({ data }) => {
                setRow(data)
                setLots([...lots, ...data.rows])
            })
    }

    async function changeLot(lot: ILot) {
        const updatedLots = lots.map((l) => {
            return l.id === lot.id ? lot : l
        })
        setLots(updatedLots)
    }

    function removeLot(id: string) {
        setLots(lots.filter((l) => l.id !== id))
    }

    useEffect(() => {
        OGSetTitle('TasteNFT')
        OGSetDescription(
            'The NFT marketplace for sensual digital artwork empowering creators of exclusive fine nude and body art'
        )
        OGUpdateUrl()
        getTop()
        userAPI.featured().then(({ data }) => setUsers(data))
    }, [getTop])

    return (
        <>
            <EventContext.Provider
                value={{
                    onPaginationPage: addLots,
                    onTimerEnd: removeLot,
                    onTimerUpdated: changeLot,
                }}
            >
                <div className="m-bottom-20">
                    {!!lots.length ? (
                        <TopLotsCarousel Lots={top}></TopLotsCarousel>
                    ) : null}
                </div>
                {loading ? <PageLoader></PageLoader> : null}
                <div className="selects">
                    <div className="selects__item">
                        <Select
                            name="sort"
                            onChange={setSort}
                            options={sortOptions}
                        ></Select>
                    </div>
                </div>
                <List lots={lots}></List>
                <div className="pagination-btn">
                    <Link to="/search">
                        <Button size="large">View more</Button>
                    </Link>
                </div>

                {!loading && !row?.rows.length ? (
                    <div className="empty">Nothing here yet</div>
                ) : null}
                {users ? <UserList users={users}></UserList> : null}
            </EventContext.Provider>
        </>
    )
}
