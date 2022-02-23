import { FC, useMemo } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PaginationLoader } from '../components/Loader'
import { Button } from '../components/UI/Buttons'
import { EventContext } from '../ctx/event'
import { TRow } from '../types/api'
import { Margin } from './Margin'
import ReactPaginate from 'react-paginate'
import { useQuery } from '../hooks/useQuery'

export const NumPagination: FC<{
    row: TRow<any>
}> = ({ row }) => {
    const { onPaginationPage } = useContext(EventContext)
    const query = useQuery('page')
    const [page, setPage] = useState(+(query.getValue() || 1) - 1)

    const totalPages = useMemo(
        () => Math.ceil(row.totalRows / row.pageSize),
        [row]
    )

    function onPage(page: number) {
        setPage(page)
        query.setValue((page + 1).toString())
        if (onPaginationPage) onPaginationPage(page + 1)
    }

    return (
        <ReactPaginate
            pageCount={totalPages}
            onPageChange={(e) => onPage(e.selected)}
            className="pagination"
            initialPage={page}
            nextLabel={<i className="fas fa-chevron-right"></i>}
            previousLabel={<i className="fas fa-chevron-left"></i>}
        ></ReactPaginate>
    )
}

export const Pagination: FC<{
    row: TRow<any>
    length: number
}> = ({ row, children, length }) => {
    const { onPaginationPage } = useContext(EventContext)
    const [page, setPage] = useState(1)
    const [btn, setBtn] = useState(row.totalRows > row.pageSize)
    const [active, setActive] = useState(false)
    const hasMore = useMemo(
        () => row.page < row.totalRows / row.pageSize,
        [row]
    )
    const showBtnStart = useMemo(() => btn && hasMore, [btn, hasMore])

    function nextPage() {
        setPage(page + 1)
        if (onPaginationPage) onPaginationPage(page + 1)
    }
    function start() {
        setActive(true)
        setBtn(false)
        window.scrollTo({ top: window.scrollY - 100, behavior: 'smooth' })
    }

    return active ? (
        <InfiniteScroll
            next={nextPage}
            loader={<PaginationLoader></PaginationLoader>}
            hasMore={hasMore}
            dataLength={length}
            style={{ overflow: 'initial' }}
        >
            {children}
        </InfiniteScroll>
    ) : (
        <>
            {children}
            {showBtnStart ? (
                <Margin margin={{ top: 20 }}>
                    <div className="pagination-btn">
                        <Button
                            onClick={start}
                            stylePreset="semitransparent"
                            size="large"
                        >
                            Load More
                        </Button>
                    </div>
                </Margin>
            ) : null}
        </>
    )
}
