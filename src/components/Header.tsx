import { Link } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Metamask } from './Metamask'
import { img } from '../assets/assets'
import { useEffect, useState } from 'react'
import { Popup } from '../hoc/Popup'
import { Settings } from './profile/Settings'
import { IUser } from '../types/user'
import { Username } from './profile/Profile'
import { useDispatch } from 'react-redux'
import { action_logout } from '../store/actions/auth'
import { getUserAvatar, getUserName } from '../utils/methods'
import { ITokenOriginalView } from '../types/lot'
import { useRedirect } from '../hooks/useRedirect'
import { EventContext } from '../ctx/event'
import { Button } from './UI/Buttons'
import { Editor } from './UI/Card/Editor'
import { ImportPopup } from './ImportedTokens'
import { useTypedLocation } from '../hooks/useTypedLocation'

export const Header = () => {
    const { auth } = useTypedSelector((store) => store)
    const { history } = useTypedLocation()
    const [text, setText] = useState('')

    function search(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        history.push('/search', { search: text })
    }

    return (
        <header className="header">
            <div className="header__body">
                <Link to="/">
                    <div className="header__logo">
                        <img src={img.logo} alt="logo" />
                    </div>
                </Link>
                <form className="header__search" onSubmit={search}>
                    <img src={img.search} alt="search" />
                    <input
                        value={text}
                        onChange={({ target: { value } }) => setText(value)}
                        type="search"
                        placeholder="Search for ..."
                    />
                </form>
                <div className="header__links">
                    <a
                        href="https://www.tastenfts.com/artist-application/"
                        className="header__link"
                    >
                        Apply to list
                    </a>
                    <a
                        href="https://www.tastenfts.com/"
                        className="header__link"
                    >
                        Buy TASTE
                    </a>
                    <a
                        href="https://forms.gle/p8nGGm8aFG84E75G6"
                        className="header__link"
                    >
                        Report artwork
                    </a>
                </div>

                {!auth.id ? (
                    <Metamask></Metamask>
                ) : (
                    <HeaderAuth auth={auth}></HeaderAuth>
                )}
            </div>
        </header>
    )
}

export const HeaderAuth = ({ auth }: { auth: IUser }) => {
    const [dropdown, setDropdown] = useState(false)
    const [createArtwork, setCreateArtwork] = useState(false)
    const redirect = useRedirect()

    function onEnd(data: ITokenOriginalView) {
        redirect.toOriginToken(data.id)
        setCreateArtwork(false)
    }

    function overDropdownHandler() {
        setDropdown(false)
    }

    useEffect(() => {
        dropdown
            ? document.addEventListener('click', overDropdownHandler)
            : document.removeEventListener('click', overDropdownHandler)
        return () => document.removeEventListener('click', overDropdownHandler)
    }, [dropdown])

    return (
        <EventContext.Provider
            value={{ onEditorCreated: onEnd, onEditorErrorSendFile: onEnd }}
        >
            <>
                {auth.role !== 'GUEST' ? (
                    <Button
                        onClick={() => setCreateArtwork(!createArtwork)}
                        size="large"
                        className="header__connect"
                    >
                        + Add artwork
                    </Button>
                ) : null}
                <div
                    className="header-auth"
                    onClick={() => setDropdown(!dropdown)}
                >
                    <div className="header-auth__inner">
                        <div className="header-auth__avatar">
                            <img
                                src={getUserAvatar(auth.avatar)}
                                alt="avatar"
                            />
                        </div>
                        <div className="header-auth__content">
                            <div className="header-auth__name">
                                {getUserName(auth)}
                            </div>
                            {/* <div className="lk__person-info"> */}
                            <Username user={auth}></Username>
                            {/* <div className="lk__person-balance balance">
                                <div className="balance__title">Balance:</div>
                                <img src={img.kiss} alt="like" />
                                <div className="balance__amount">1,5M</div>
                            </div> */}
                            {/* </div> */}
                        </div>
                        <div className="header-auth__arrow">
                            <img src={img.lkDropdownIcon} alt="dropdown" />
                        </div>
                    </div>
                    <Dropdown state={[dropdown, setDropdown]}></Dropdown>
                </div>

                <Popup
                    showState={[createArtwork, setCreateArtwork]}
                    title="Creating artwork"
                >
                    <Editor></Editor>
                </Popup>
            </>
        </EventContext.Provider>
    )
}

export const Dropdown = ({
    state,
}: {
    state: [boolean, (state: boolean) => void]
}) => {
    const [popup, setPopup] = useState(false)
    const [importer, setImporter] = useState(false)
    const [show] = state
    const { auth } = useTypedSelector((store) => store)
    const dispatch = useDispatch()

    function logout() {
        dispatch(action_logout())
    }

    return (
        <>
            <div
                className={`header-auth-dropdown ${
                    show ? 'header-auth-dropdown--open' : ''
                }`}
            >
                <div
                    className="header-auth-dropdown__item header-auth-dropdown__item-address"
                    onClick={(e) => e.stopPropagation()}
                >
                    {`Address: ${auth.metamaskAddress}`}
                </div>
                <Link to="/profile" className="header-auth-dropdown__item">
                    My profile
                </Link>
                <div
                    className="header-auth-dropdown__item"
                    onClick={() => setPopup(true)}
                >
                    Account settings
                </div>
                <div
                    className="header-auth-dropdown__item"
                    onClick={() => setImporter(true)}
                >
                    Import NFT from contract
                </div>
                <div
                    className="header-auth-dropdown__item header-auth-dropdown__item-exit"
                    onClick={logout}
                >
                    Log out
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Popup showState={[popup, setPopup]} title="Edit your profile">
                    <Settings onUpdate={() => setPopup(false)}></Settings>
                </Popup>
                <ImportPopup showState={[importer, setImporter]}></ImportPopup>
            </div>
        </>
    )
}
