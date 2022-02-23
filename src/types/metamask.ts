import { IUser } from './user'
import { provider } from 'web3-core/types/index'
import Web3 from 'web3'

type TMethods =
    | 'personal_sign'
    | 'eth_requestAccounts'
    | 'wallet_switchEthereumChain'
    | 'wallet_addEthereumChain'
    | 'eth_signTypedData'
    | 'eth_signTypedData_v3'

type Event<Name, HandlerData> = (
    e: Name,
    handler: (data: HandlerData) => void
) => void

type Events = Event<'connect', { chainId: string }> &
    Event<'disconnect', any> &
    Event<'accountsChanged', string[]> &
    Event<'chainChanged', string>

export interface Ethereum {
    chainId: string
    selectedAddress?: string
    networkVersion: string
    request: (data: {
        method: TMethods
        params?: any
        from?: any
    }) => Promise<any>
    on: Events
}

declare global {
    interface Window {
        ethereum?: Ethereum
        web3: Web3
    }
}

export interface IMetamask_resMessage {
    isSign: boolean
    metamaskMessage: string
}

export interface IapproveWBNB {
    blockHash: string
    blockNumber: number
    contractAddress: null
    cumulativeGasUsed: number
    from: string
    gasUsed: number
    logsBloom: string
    status: true
    to: string
    transactionHash: string
    transactionIndex: number
    type: string
}

export interface MetamaskError {
    message: string
    code: number
    data?: unknown
}
