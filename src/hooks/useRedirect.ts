import { useHistory } from 'react-router-dom'
export type ToProfileState = { thirdPartyNFT?: boolean } | undefined
export function useRedirect() {
    const history = useHistory()
    return {
        toLot(id: string) {
            history.push(`/lot/${id}`)
        },
        toOriginToken(id: string) {
            history.push(`/original-token/${id}`)
        },
        toIndex() {
            history.push('/')
        },
        toProfile(state?: ToProfileState) {
            history.push('/profile', state)
        },
    }
}
