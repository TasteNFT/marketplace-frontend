import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { Popup } from '../../hoc/Popup'
import { TRow } from '../../types/api'
import { IUser } from '../../types/user'
import { user as userAPI } from '../../utils/api/index'
import { Button, IOption, TextButtons } from '../UI/Buttons'
import { Pagination } from '../../hoc/Pagination'
import { EventContext } from '../../ctx/event'
import { UserMini } from '../Users'
import { auth as authAPI } from '../../utils/api/index'
import { useDispatch } from 'react-redux'
import { action_authFetch } from '../../store/actions/auth'
import { Hr } from '../UI/Hr'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { Empty } from '../Empty'
import { Margin } from '../../hoc/Margin'
import { useUserMeta } from '../../hooks/useUserMeta'
import _ from 'lodash'

export const Following: FC<{
    showState: [boolean, (e: boolean) => void]
    user: IUser
}> = ({ showState, user }) => {
    const [row, setRow] = useState<TRow<IUser>>()
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const options: IOption[] = [
        {
            label: 'Followers',
            value: 'Followers',
        },
        {
            label: 'Followings',
            value: 'Followings',
        },
    ]
    const [option, setOption] = useState(_.head(options))

    const addUser = useCallback(
        (page: number, clear?: boolean) => {
            function updUsers(newUsers: IUser[]) {
                setUsers((oldUsers) => [
                    ...(clear ? [] : oldUsers),
                    ...newUsers,
                ])
            }

            switch (option?.value) {
                case 'Followers':
                    return userAPI.following
                        .followers(user.id, { page })
                        .then((u) => {
                            updUsers(u.data.rows)
                            setRow(u.data)
                        })
                case 'Followings':
                    return userAPI.following
                        .followings(user.id, { page })
                        .then((u) => {
                            setRow(u.data)
                            updUsers(u.data.rows)
                        })

                default:
                    break
            }
        },
        [option, user]
    )

    function changeFollowing(user: IUser) {
        setUsers((oldUsers) => {
            const filteredUsers = oldUsers.filter((u) => u.id !== user.id)
            return [...filteredUsers, user]
        })
    }

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            await addUser(1, true)
            setLoading(false)
        }
        init()
    }, [addUser])

    return (
        <EventContext.Provider
            value={{ onPaginationPage: addUser, onFollowed: changeFollowing }}
        >
            <Popup showState={showState} title="Follow">
                <TextButtons
                    options={options}
                    state={[option, setOption]}
                ></TextButtons>
                <Hr></Hr>
                {row && users.length ? (
                    <Pagination row={row} length={users.length}>
                        {users.map((user) => (
                            <div className="follower" key={user.id}>
                                <UserMini
                                    user={user}
                                    className="follower__user"
                                ></UserMini>
                                <FollowButton user={user}></FollowButton>
                            </div>
                        ))}
                    </Pagination>
                ) : (
                    !loading && (
                        <Margin margin={{ top: 40 }}>
                            <Empty></Empty>
                        </Margin>
                    )
                )}
            </Popup>
        </EventContext.Provider>
    )
}

export const FollowButton: FC<{
    user: IUser
    className?: string
    size?: 'small' | 'large'
    stylePreset?: 'semitransparent' | 'orange'
}> = ({ user, className, stylePreset, size }) => {
    const dispatch = useDispatch()
    const { auth } = useTypedSelector((s) => s)
    const { iAmFollower } = useUserMeta(user)
    const { onFollowed } = useContext(EventContext)

    async function updateUser(userId: string) {
        dispatch(action_authFetch())
        return userAPI.id(userId).then((res) => res.data)
    }

    async function follow(userId: string) {
        await authAPI.follow(userId)
        const user = await updateUser(userId)
        if (onFollowed) onFollowed(user)
    }
    async function unfollow(userId: string) {
        await authAPI.unfollow(userId)
        const user = await updateUser(userId)
        if (onFollowed) onFollowed(user)
    }

    return !!auth.id.length && auth.id !== user.id ? (
        iAmFollower ? (
            <Button
                className={className}
                onClick={() => unfollow(user.id)}
                stylePreset={stylePreset}
                size={size}
            >
                Unfollow
            </Button>
        ) : (
            <Button
                className={className}
                onClick={() => follow(user.id)}
                stylePreset={stylePreset}
                size={size}
            >
                Follow
            </Button>
        )
    ) : null
}
