export enum EUserRole {
    Guest = 'GUEST',
    User = 'USER',
    Moderator = 'MODERATOR',
    Admin = 'ADMIN',
}

export interface IUserRequest {
    name: string
    metaName: string | null
    socialInstagram: string
    socialOnlyfans: string
    socialTwitch: string
    socialTwitter: string
    description: string
    email: string | null
}

export interface UserToUserView {
    id: string
    userId: string // following user id
    followerId: string // follower user id
}

export interface PremiumAccessView {
    id: string
    authorUserId: string
    clientUserId: string
}

export interface IUser {
    id: string
    role: EUserRole
    email: string
    metaName: string | null
    name: string
    description: string
    socialTwitch: string
    socialInstagram: string
    socialTwitter: string
    socialOnlyfans: string
    avatar: string | null // sha256 for route: /sha256/:sha256
    background: string | null // sha256 for route: /sha256/:sha256
    createdAt: string // Date
    isActivated: boolean
    metamaskAddress: string
    totalSalesCount: number
    totalSalesProfit: string // decimal

    // special
    followingsCount?: number
    followersCount?: number

    // relations
    Folls?: UserToUserView[]
    PremiumAccess?: PremiumAccessView[]
}
