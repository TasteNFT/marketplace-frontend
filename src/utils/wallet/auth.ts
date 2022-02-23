import { store } from '../../store'
import { action_logout } from '../../store/actions/auth'
import { MetamaskMethods } from './metamask/provider'
import { notifications } from '../notification'
import { walletConnect } from './walletConnect'
import { connect } from './walletConnect/handlers'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { nodeConfig } from './metamask/config'
// walletConnect
export async function loginAsMetamask() {
    const metamaskMethods = await MetamaskMethods()
    await metamaskMethods.auth()
}

let opened = false
export async function loginAsWalletConnect() {
    if (!walletConnect.connected) {
        if (!opened) {
            await walletConnect.createSession({
                chainId: nodeConfig.networkVersion,
            })
            opened = true
            return
        }
        QRCodeModal.open(walletConnect.uri, '')
        return
    }
    notifications.authMessageSended()
    await connect()
}

export async function reloadWalletConnect() {
    if (walletConnect.connected) {
        walletConnect.killSession()
    }
}

export async function logout() {
    const { auth } = store.getState()
    if (!!auth.id) await store.dispatch<any>(action_logout())
}
