import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pagination } from '../../hoc/Pagination'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { IUser } from '../../types/user'
import { fromTokenToCard } from '../OriginalTokens'
import { IOption, TextButtons } from '../UI/Buttons'
import { Cards } from '../UI/Card/List'
import {
    auth as authAPI,
    user as userAPI,
    originalToken as tokenOriginalAPI,
} from '../../utils/api/index'
import { ICard } from '../../types/card'
import { TRow } from '../../types/api'
import { EventContext } from '../../ctx/event'
import { PageLoader } from '../Loader'
import { Margin } from '../../hoc/Margin'
import { ISelectOption, Select } from '../UI/Select'
import { ImportedCardsWrapper } from '../ImportedTokens'
import { useLocation } from 'react-router'
import { ToProfileState } from '../../hooks/useRedirect'
import { TokenHistoryView } from '../../types/lot'
import { TokenHistoryColumn } from '../UI/TokenHistory'
import _ from 'lodash'

export const UserCards = ({ user }: { user: IUser }) => {
    const { auth } = useTypedSelector((s) => s)
    const isCreator = useMemo(() => auth.id === user.id, [auth, user])

    const [row, setRow] = useState<TRow<any>>()
    const [cards, setCards] = useState<ICard[]>([])
    const [histories, setHistories] = useState<TokenHistoryView[]>([])

    const [page, setPage] = useState(1)

    const [loading, setLoading] = useState(false)
    const savedContracts = useTypedSelector(
        (s) => s.localStorage.importedContract
    )
    const routeState = useLocation().state as ToProfileState

    const categories: IOption[] = useMemo(() => {
        const res: IOption[] = [
            { label: 'NFTs', value: 'Created' },
            { label: 'Owned', value: 'Collected' },
            { label: 'Transactions', value: 'Transactions' },
        ]
        if (auth.id === user.id && savedContracts?.length) {
            return [
                ...res,
                {
                    label: 'Third-Party NFTs',
                    value: 'importer',
                },
            ]
        }
        return res
    }, [auth, user, savedContracts])

    const sortNFT: ISelectOption<{
        desc: boolean
        sort: 'createdAt' | 'createdAt' | 'name'
    }>[] = useMemo(() => {
        return [
            {
                label: 'Newest',
                value: 'createdAt',
                meta: {
                    desc: true,
                    sort: 'createdAt',
                },
            },
            {
                label: 'Oldest',
                value: 'createdAtDesc',
                meta: {
                    desc: false,
                    sort: 'createdAt',
                },
            },
            {
                label: 'By title: A-Z',
                value: 'name',
                meta: {
                    desc: false,
                    sort: 'name',
                },
            },
            {
                label: 'By title: Z-A',
                value: 'nameDesc',
                meta: {
                    desc: true,
                    sort: 'name',
                },
            },
        ]
    }, [])

    // const sortTransactions = useMemo(() => {
    //     return [
    //         {
    //             label: 'Newest',
    //             value: 'createdAt',
    //             meta: {
    //                 desc: true,
    //                 sort: 'createdAt',
    //             },
    //         },
    //         {
    //             label: 'Oldest',
    //             value: 'createdAtDesc',
    //             meta: {
    //                 desc: false,
    //                 sort: 'createdAt',
    //             },
    //         },
    //     ] as ISelectOption<{
    //         desc: boolean
    //         sort: 'createdAt'
    //     }>[]
    // }, [])

    const [category, setCategory] = useState(
        routeState?.thirdPartyNFT
            ? categories.find((c) => c.value === 'importer')!
            : _.head(categories)
    )
    const [sortNFTState, setSortNFTState] = useState(_.head(sortNFT))
    // const [sortTransactionsState, setSortTransactionsState] = useState(
    //     sortTransactions[0]
    // )

    const getAuthData = useCallback(
        async (page: number) => {
            const params = {
                page,
                sortBy: sortNFTState?.meta?.sort,
                sortDesc: sortNFTState?.meta?.desc,
            }
            // const paramsBids = {
            //     page,
            //     sortBy: sortTransactionsState.meta?.sort,
            //     sortDesc: sortTransactionsState.meta?.desc,
            // }
            switch (category?.value) {
                case 'Created':
                    return authAPI.lotsCreated(params).then((res) => {
                        setRow(res.data)
                        setCards((old) => [
                            ...old,
                            ...fromTokenToCard(res.data.rows),
                        ])
                    })
                case 'Collected':
                    return authAPI.lotsCollected(params).then((res) => {
                        setRow(res.data)
                        setCards((old) => [
                            ...old,
                            ...fromTokenToCard(res.data.rows),
                        ])
                    })
                case 'Transactions':
                    return tokenOriginalAPI
                        .history({
                            page,
                            tokenChangedOwnerWithUserId: user.id,
                        })
                        .then((res) => {
                            setRow(res.data)
                            setHistories((old) => [...old, ...res.data.rows])
                        })

                default:
                    return
            }
        },
        [category, sortNFTState, user /*sortTransactionsState*/]
    )

    const getUserData = useCallback(
        (page: number) => {
            const params = {
                page,
                sortBy: sortNFTState?.meta?.sort,
                sortDesc: sortNFTState?.meta?.desc,
            }
            // const paramsBids = {
            //     page,
            //     sortBy: sortTransactionsState.meta?.sort,
            //     sortDesc: sortTransactionsState.meta?.desc,
            // }

            switch (category?.value) {
                case 'Created':
                    return userAPI.tokenOriginal
                        .created(user.id, params)
                        .then((res) => {
                            setRow(res.data)
                            setCards((old) => [
                                ...old,
                                ...fromTokenToCard(res.data.rows),
                            ])
                        })
                case 'Collected':
                    return userAPI.tokenOriginal
                        .collected(user.id, params)
                        .then((res) => {
                            setCards((old) => [
                                ...old,
                                ...fromTokenToCard(res.data.rows),
                            ])
                            setRow(res.data)
                        })
                case 'Transactions':
                    return tokenOriginalAPI
                        .history({
                            page,
                            tokenChangedOwnerWithUserId: user.id,
                        })
                        .then((res) => {
                            setRow(res.data)
                            setHistories((old) => [...old, ...res.data.rows])
                        })
                default:
                    return
            }
        },
        [category, sortNFTState, user]
    )
    function addData() {
        setPage(page + 1)
        isCreator ? getAuthData(page + 1) : getUserData(page + 1)
    }

    const getDataFromStart = useCallback(async () => {
        setLoading(true)
        setPage(1)
        setRow(undefined)
        setCards([])
        setHistories([])
        try {
            isCreator ? await getAuthData(1) : await getUserData(1)
        } catch (e) {}
        setLoading(false)
    }, [getAuthData, getUserData, isCreator])

    function removeCard(id: string) {
        setCards(cards.filter((t) => t.id !== id))
    }

    useEffect(() => {
        getDataFromStart()
    }, [getDataFromStart])

    return (
        <EventContext.Provider
            value={{
                onPaginationPage: addData,
                onCardRemove: removeCard,
                onCardHided: removeCard,
            }}
        >
            {loading ? <PageLoader></PageLoader> : null}
            <TextButtons
                options={categories}
                state={[category, setCategory]}
            ></TextButtons>
            {category?.value !== 'importer' &&
                category?.value !== 'Transactions' && (
                    <Margin margin={{ top: 20 }}>
                        <div className="selects">
                            <div className="selects__item">
                                {/* {category.value === 'Transactions' ? (
                                <Select
                                    options={sortTransactions}
                                    state={[
                                        sortTransactionsState,
                                        setSortTransactionsState,
                                    ]}
                                ></Select>
                            ) : ( */}
                                <Select
                                    options={sortNFT}
                                    onChange={setSortNFTState}
                                ></Select>
                                {/* )} */}
                            </div>
                        </div>
                    </Margin>
                )}

            {row ? (
                <Margin margin={{ top: 20 }}>
                    {category?.value === 'Transactions' ? (
                        <Pagination row={row} length={histories.length}>
                            <TokenHistoryColumn
                                histories={histories}
                            ></TokenHistoryColumn>
                        </Pagination>
                    ) : (
                        <Pagination row={row} length={cards.length}>
                            {!loading && cards.length ? (
                                <Cards cards={cards}></Cards>
                            ) : (
                                <div className="empty">Nothing here yet</div>
                            )}
                        </Pagination>
                    )}
                </Margin>
            ) : null}

            {category?.value === 'importer' && (
                <ImportedCardsWrapper></ImportedCardsWrapper>
            )}
        </EventContext.Provider>
    )
}
