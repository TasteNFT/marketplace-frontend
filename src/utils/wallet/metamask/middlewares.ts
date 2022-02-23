import { errors } from '../../notification'
import { nodeConfig } from './config'

export async function hasMetamask() {
    if (!window.ethereum) {
        // store.dispatch(action_setOnboard(true)) //активация попапа
        errors.needMetamask()
        return Promise.reject()
    }
}

export async function isCorrectChainId() {
    const eth = window.ethereum!

    if (eth.chainId !== nodeConfig.chainId) {
        await eth
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: nodeConfig.chainId }],
            })
            .catch(async (switchError) => {
                switch (switchError.code) {
                    case 4902:
                        await eth.request({
                            method: 'wallet_addEthereumChain',
                            params: [nodeConfig],
                        })
                        break
                    default:
                        return Promise.reject()
                }
            })
        await new Promise((res) => {
            setTimeout(() => {
                res(true)
            }, 1000)
        })
    }
}

export async function connect() {
    const eth = window.ethereum!

    return await eth.request({
        method: 'eth_requestAccounts',
    })
}
