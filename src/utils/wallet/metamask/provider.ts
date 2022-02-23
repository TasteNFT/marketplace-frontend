import Web3 from 'web3'
import { init as initMetamaskEvents } from './events'
import { Methods } from './methods'
import { connect, hasMetamask, isCorrectChainId } from './middlewares'

initMetamaskEvents()

export async function MetamaskMethods() {
    await hasMetamask()
    initMetamaskEvents()
    await isCorrectChainId()
    await connect()

    const eth = window.ethereum!
    const web3 = new Web3(eth as any)
    web3.eth.defaultAccount = eth.selectedAddress!
    return new Methods(web3)
}
