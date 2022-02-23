import { IUser } from '../types/user'
import { Username } from './profile/Profile'
import { Link } from 'react-router-dom'
import {
    getTastePrice,
    getUserAvatar,
    getUserLink,
    getUserName,
    reduction,
} from '../utils/methods'
import { FC, useCallback, useState } from 'react'
import { fromWeiToString } from '../utils/wallet/utils'
import { useEffect } from 'react'

export const UserList: FC<{
    users: IUser[]
    title?: string
}> = ({ users, title }) => {
    return (
        <section className="creator">
            <div className="container">
                <div className="creator__body">
                    <div className="creator__title">
                        {title ? title : 'Featured creators'}
                    </div>
                    <div className="creator__content seller">
                        {users.map((u) => (
                            <UserItem user={u} key={u.id}></UserItem>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export const UserItem: FC<{
    user: IUser
}> = ({ user }) => {
    const [usd, setUsd] = useState('0')

    const initUsd = useCallback(async () => {
        const getUsd = await getTastePrice
        setUsd(getUsd(fromWeiToString(user.totalSalesProfit)))
    }, [user])

    useEffect(() => {
        initUsd()
    }, [user.totalSalesProfit, initUsd])
    return (
        <div className="seller__item">
            <Link to={getUserLink(user)} className="seller__image">
                <img src={getUserAvatar(user.avatar)} alt="avatar" />
            </Link>
            <Link to={getUserLink(user)} className="seller__title">
                {getUserName(user)}
            </Link>
            <Username user={user} className="seller__nickname"></Username>
            <div className="seller__quantity">
                {user.totalSalesCount} sales on{' '}
                {reduction(fromWeiToString(user.totalSalesProfit))} TASTE ({usd}
                $)
            </div>
        </div>
    )
}

export const UserMini: FC<{
    user: IUser
    className?: string
    size?: 'middle' | 'small'
}> = ({ user, className, size }) => {
    return (
        <Link to={getUserLink(user)} className={`user-mini ${className || ''}`}>
            <div
                className={`user-mini__avatar ${
                    size ? `user-mini__avatar-${size}` : ''
                }`}
            >
                <img src={getUserAvatar(user.avatar)} alt="" />
            </div>
            <div className="user-mini__info">
                <div
                    className={`user-mini__name ${
                        size ? `user-mini__name-${size}` : ''
                    }`}
                >
                    {getUserName(user)}
                </div>
                {user.metaName ? (
                    <div
                        className={`user-mini__metaname ${
                            size ? `user-mini__metaname-${size}` : ''
                        }`}
                    >
                        @{user.metaName}
                    </div>
                ) : null}
            </div>
        </Link>
    )
}
