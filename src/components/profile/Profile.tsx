import { img } from '../../assets/assets'
import { IUser } from '../../types/user'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getImgLink, getUserAvatar } from '../../utils/methods'
import { getUserName } from '../../utils/methods'
import { FollowButton, Following } from './Following'

interface IProps {
    user: IUser
}

export const Profile = ({ user }: IProps) => {
    const social = useMemo(
        () => [
            {
                show: user.socialTwitter,
                url: user.socialTwitter,
                icon: img.twitter,
                name: 'Twitter',
            },
            {
                show: user.socialTwitch,
                url: user.socialTwitch,
                icon: img.twitch,
                name: 'Twitch',
            },
            {
                show: user.socialOnlyfans,
                url: user.socialOnlyfans,
                icon: img.onlyfans,
                name: 'OnlyFans',
            },
            {
                show: user.socialInstagram,
                url: user.socialInstagram,
                icon: img.instagram,
                name: 'Instagram',
            },
        ],
        [user]
    )
    const { auth } = useTypedSelector((s) => s)
    const [showFollowing, setShowFollowing] = useState(false)
    // const showSocios = useMemo(
    //     () => !!social.filter((s) => s.show).length,
    //     [social]
    // )

    const showButtons = useMemo(
        () => !!auth.id.length && auth.id !== user.id,
        [user, auth]
    )

    useEffect(() => {
        setShowFollowing(false)
    }, [user])

    return (
        <>
            <section className="profile">
                {!!user.background && (
                    <img
                        src={getImgLink(user.background)}
                        alt=""
                        className="profile__bg"
                    />
                )}
                <div className="profile__header">
                    <div className="profile__header-person person">
                        <div className="person__image">
                            <img
                                src={getUserAvatar(user.avatar)}
                                alt="avatar"
                            />
                        </div>
                        <div className="person__info">
                            <div className="person__info-title">
                                {getUserName(user)}
                            </div>
                            <Username user={user}></Username>
                        </div>
                    </div>

                    <div className="profile__header-action action">
                        <div className="action__follow">
                            <div
                                className="action__follow-item"
                                onClick={() => setShowFollowing(true)}
                            >
                                <h6>{user.followersCount || 0}</h6>
                                <p>Followers</p>
                            </div>
                            <div
                                className="action__follow-item"
                                onClick={() => setShowFollowing(true)}
                            >
                                <h6>{user.followingsCount || 0}</h6>
                                <p>Following</p>
                            </div>
                            {showButtons && (
                                <div className="action__follow-item">
                                    <FollowButton user={user}></FollowButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile__body">
                    <div className="profile__socio socio">
                        {social.map((s) =>
                            s.show ? (
                                <a
                                    className="socio__item"
                                    href={s.url}
                                    key={s.name}
                                >
                                    <img src={s.icon} alt={s.name} />
                                    <span>{s.name}</span>
                                </a>
                            ) : null
                        )}
                    </div>
                </div>
                {user.description ? (
                    <pre className="profile__text">
                        <span>Bio:</span> {user.description}
                    </pre>
                ) : null}
            </section>
            <Following
                showState={[showFollowing, setShowFollowing]}
                user={user}
            ></Following>
        </>
    )
}

interface IPropsUsername {
    user?: IUser
    className?: string | undefined
    isLink?: boolean
}

export const Username = ({ user, className, isLink }: IPropsUsername) => {
    return (
        <>
            {user ? (
                isLink ? (
                    <Link
                        to={`/user/${user.id}`}
                        className={`username ${className || ''}`}
                    >
                        {user.metaName ? `@${user.metaName}` : ''}
                    </Link>
                ) : (
                    <div className={`username ${className || ''}`}>
                        {user.metaName ? `@${user.metaName}` : ''}
                    </div>
                )
            ) : null}
        </>
    )
}
