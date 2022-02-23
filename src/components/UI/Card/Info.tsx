import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { img } from '../../../assets/assets'
import { useTypedSelector } from '../../../hooks/useTypedSelector'
import { ICard } from '../../../types/card'
import {
    getTastePrice,
    getUserAvatar,
    getUserLink,
    getUserName,
    reduction,
} from '../../../utils/methods'
import { removeToken } from '../../../utils/lot'
import { Username } from '../../profile/Profile'
import { Popup } from '../../../hoc/Popup'
import { useRedirect } from '../../../hooks/useRedirect'
import { fromWeiToString } from '../../../utils/wallet/utils'
import { Share } from '../Share'
import {
    Button,
    IconButton,
    IconButtons,
    IconMenu,
    IconMenuButton,
} from '../Buttons'
import { Margin } from '../../../hoc/Margin'
import { Editor } from './Editor'
import { UpdateTimer } from '../Timer'
import { useCardMeta } from '../../../hooks/useCardMeta'
import { createConfigWithEnvType } from '../../../utils/wallet/metamask/methods'

export const CardInfo: FC<{
    card: ICard
    type?: 'carousel'
    reverseWrap?: boolean
}> = ({ card, children, type, reverseWrap }) => {
    const { auth } = useTypedSelector((store) => store)
    const [usd, setUsd] = useState('0')
    const [showEditor, setShowEditor] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [showSetTimer, setShowTimer] = useState(false)
    const redirect = useRedirect()
    // const { onCardUpdated } = useContext(EventContext)
    const {
        isLot,
        isAuthor,
        isDraft,
        isBan,
        isOriginalToken,
        showShareBtn,
        canSetNewTimer,
    } = useCardMeta(card)

    const initUsd = useCallback(async () => {
        const getUsd = await getTastePrice
        setUsd(getUsd(fromWeiToString(card?.currentCost || '0')))
    }, [card])

    useEffect(() => {
        initUsd()
    }, [initUsd])

    const nftToken = useMemo(
        () => card.TokensNFT?.find((t) => t.userId === auth.id),
        [card, auth]
    )

    // function updated() {
    //     setShowEditor(false)
    //     if (onCardUpdated) onCardUpdated()
    // }
    async function remove() {
        await removeToken(card.id)
        redirect.toIndex()
    }
    function toBsc() {
        if (!nftToken) return
        window.open(
            `https://bscscan.com/token/${
                createConfigWithEnvType(card.marketplaceVer).main.addresses
                    .factory
            }?a=${nftToken.token}`,
            '_blank'
        )
    }
    return (
        <section className={`about ${reverseWrap ? 'about--wrapreverse' : ''}`}>
            <div className="about__left">
                <Margin margin={{ top: 20 }}>
                    <div className="user-info">
                        {card.User ? (
                            <div className="user-info__header">
                                <Link
                                    to={getUserLink(card.User)}
                                    className="user-info__ava"
                                >
                                    <img
                                        src={getUserAvatar(card.User.avatar)}
                                        alt="avatar"
                                    />
                                </Link>
                                <Link to={getUserLink(card.User)}>
                                    <div className="user-info__personal">
                                        <div className="user-info__personal-name">
                                            {getUserName(card.User)}
                                        </div>
                                        <Username
                                            user={card.User}
                                            className="user-info__personal-nick"
                                        ></Username>
                                    </div>
                                </Link>
                            </div>
                        ) : null}
                        <h1 className="user-info__title">{card.name}</h1>

                        {card.copiesSold && card.copiesTotal ? (
                            <div className="user-info__text">
                                <span>Сopy:</span> {card.copiesSold} of{' '}
                                {card.copiesTotal}
                            </div>
                        ) : null}

                        <div className="user-info__text">
                            <span>Description:</span> {card.description}
                        </div>
                        {card.creatorReward ? (
                            <div className="user-info__text">
                                <span>Author’s royalty: </span>
                                {card.creatorReward}%
                            </div>
                        ) : null}
                        {card.isCommercial ? (
                            <div className="user-info__text">
                                <em>This NFT comes with commercial rights</em>
                            </div>
                        ) : null}

                        <div className="user-info__block">
                            {type === 'carousel' ? (
                                <>
                                    <div className="user-info__text">
                                        <span>Selling for:</span>
                                        <img
                                            src={img.lotSoldIcon}
                                            alt="sold"
                                            className="m-left-5 m-right-5"
                                        />
                                        {reduction(
                                            fromWeiToString(
                                                card?.currentCost || '0'
                                            )
                                        )}
                                        <span className="user-info__dollar">
                                            ({usd}$)
                                        </span>
                                    </div>
                                </>
                            ) : null}
                            <IconButtons>
                                {type === 'carousel' ? (
                                    <Link to={`/lot/${card.id}`}>
                                        <Button size="large">View</Button>
                                    </Link>
                                ) : null}
                                {nftToken ? (
                                    <IconButton handler={toBsc}>
                                        <img src={img.externalLink} alt="" />
                                    </IconButton>
                                ) : null}
                                {isAuthor && isDraft ? (
                                    <IconMenu>
                                        <IconMenuButton
                                            title="Edit"
                                            handler={() =>
                                                setShowEditor(!showEditor)
                                            }
                                        >
                                            <i className="fas fa-edit"></i>
                                        </IconMenuButton>
                                    </IconMenu>
                                ) : null}
                                {canSetNewTimer ? (
                                    <IconMenu>
                                        <IconMenuButton
                                            title="Edit timer"
                                            handler={() => setShowTimer(true)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </IconMenuButton>
                                    </IconMenu>
                                ) : null}
                                {isOriginalToken && (isBan || isDraft) ? (
                                    <IconButton handler={remove}>
                                        <i className="fas fa-trash"></i>
                                    </IconButton>
                                ) : null}
                                {showShareBtn ? (
                                    <IconButton
                                        handler={() => setShowShare(!showShare)}
                                    >
                                        <img src={img.share} alt="" />
                                    </IconButton>
                                ) : null}
                            </IconButtons>
                        </div>
                    </div>
                </Margin>
            </div>

            {children ? (
                <div className="about__right">
                    <Margin margin={{ top: 20 }}>{children}</Margin>
                </div>
            ) : null}
            {isAuthor && (
                <Popup showState={[showEditor, setShowEditor]} title="Edit NFT">
                    <Editor card={card}></Editor>
                </Popup>
            )}
            <Share
                show={[showShare, setShowShare]}
                link={`${window.location.origin}${
                    isLot ? '/lot/' : '/original-token/'
                }${card.id}`}
            ></Share>
            {isAuthor && (
                <UpdateTimer
                    state={[showSetTimer, setShowTimer]}
                    lotId={card.id}
                    expiresAt={card.expired}
                ></UpdateTimer>
            )}
        </section>
    )
}
