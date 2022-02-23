import { Profile as ProfileComponent } from '../components/profile/Profile'
import { useCallback, useState } from 'react'
import { IUser } from '../types/user'
import { useEffect } from 'react'
import { user as userAPI } from '../utils/api/index'
import { useParams } from 'react-router'
import {
    OGSetDescription,
    OGSetImage,
    OGSetTitle,
    OGTitleHelper,
    OGUpdateUrl,
} from '../utils/openGraph'
import { getUserName } from '../utils/methods'
import { UserCards } from '../components/profile/Cards'
import { EventContext } from '../ctx/event'

export const User = () => {
    const { id } = useParams<{ id: string }>()
    const [user, setUser] = useState<IUser>()

    const getData = useCallback(async () => {
        const { data } = await userAPI.metanameOrId(id.replace(/@/, ''))
        setUser(data)

        OGSetTitle(`Creator ${OGTitleHelper(getUserName(data))}`)
        OGSetDescription(data.description)
        OGSetImage(data.avatar || '')
        OGUpdateUrl()
    }, [id])

    useEffect(() => {
        getData()
    }, [getData])

    function onFollowed(user: IUser) {
        setUser(user)
    }

    return (
        <EventContext.Provider value={{ onFollowed }}>
            {user && (
                <>
                    <ProfileComponent user={user}></ProfileComponent>
                    <UserCards user={user}></UserCards>
                </>
            )}
        </EventContext.Provider>
    )
}
