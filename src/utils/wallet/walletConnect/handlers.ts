import { utf8ToHex } from 'web3-utils'
import { logout } from '../auth'
// import { nodeConfig } from '../metamask/config'
import { auth } from '../methods'
import { walletConnect } from './index'

export async function connect() {
    const { accounts, chainId } = walletConnect
    const [address] = accounts
    await auth(address, chainId.toString(), async (msg) => {
        return await walletConnect.signPersonalMessage([
            utf8ToHex(msg),
            address,
        ])
    })
}

export function disconnect(error: Error | null, payload: any) {
    if (error) {
        throw error
    }
    logout()
}
