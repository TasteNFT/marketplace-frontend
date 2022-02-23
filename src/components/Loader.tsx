import { img } from '../assets/assets'

export const IconLoader = () => {
    return (
        <div className="lds-circle">
            <div>
                <img src={img.lotSoldIcon} alt="" />
            </div>
        </div>
    )
}

export const Loader = () => {
    return (
        <div className="loader">
            <div className="loader__inner">
                <IconLoader></IconLoader>
            </div>
        </div>
    )
}

export const PaginationLoader = () => {
    return (
        <div className="pagination-loader">
            <IconLoader></IconLoader>
        </div>
    )
}

export const PageLoader = () => {
    return (
        <div className="pageloader">
            <IconLoader></IconLoader>
        </div>
    )
}

export const MetamaskLoader = () => {
    return (
        <div className="connect-loader">
            <div className="connect-loader__item">
                <div className="connect-loader__item-image">
                    <img src={img.metamaskLoader} alt="loader" />
                </div>
                <svg className="connect-loader__item-circle">
                    <circle cx="30" cy="30" r="28"></circle>
                </svg>
            </div>
        </div>
    )
}
