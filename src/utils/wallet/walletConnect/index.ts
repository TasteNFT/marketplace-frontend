import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { connect, disconnect } from './handlers'

export const walletConnect = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    qrcodeModal: QRCodeModal,
})

walletConnect.on('connect', connect)
walletConnect.on('disconnect', disconnect)
