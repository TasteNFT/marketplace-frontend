import { useMemo } from 'react'
import { IUser } from '../types/user'

export function useUserMeta(user: IUser) {
    const iAmFollower = useMemo(() => !!user.Folls?.length, [user])

    return {
        iAmFollower,
    }
}
