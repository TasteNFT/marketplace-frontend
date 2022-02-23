import { Profile as ProfileComponent } from '../components/profile/Profile'
import { useEffect } from 'react'
import {
    OGSetDescription,
    OGSetImage,
    OGSetTitle,
    OGTitleHelper,
    OGUpdateUrl,
} from '../utils/openGraph'
import { getUserName } from '../utils/methods'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { UserCards } from '../components/profile/Cards'

export const Profile = () => {
    const { auth } = useTypedSelector((s) => s)

    useEffect(() => {
        OGSetTitle(OGTitleHelper(getUserName(auth)))
        OGSetDescription(auth.description)
        OGSetImage(auth.avatar || '')
        OGUpdateUrl()
    }, [auth])

    return (
        <>
            <ProfileComponent user={auth}></ProfileComponent>
            <UserCards user={auth}></UserCards>
        </>
    )
}
