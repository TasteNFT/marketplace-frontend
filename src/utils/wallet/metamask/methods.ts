import BN from 'bn.js'
import Web3 from 'web3'
import { ImportedMetaData } from '../../../types/app'
import { Ethereum } from '../../../types/metamask'
import { envContranctVer, isProd } from '../../env'
import { json } from '../../json'
import {
    Contracts,
    ContractsWrapper,
    createConfig,
} from '../../modules/contract/contract'
import { ContractVersion } from '../../modules/contract/types'
import { auth } from '../methods'
// import { auth as authAPI } from '../../api'

export function createConfigWithEnvType(ver?: ContractVersion) {
    return createConfig(isProd, ver || envContranctVer)
}

export class Methods {
    private eth: Ethereum
    public web3: Web3
    private wrapper: ContractsWrapper
    public contracts: Contracts
    constructor(web3: Web3) {
        this.eth = window.ethereum!
        this.web3 = web3
        this.contracts = new Contracts(
            createConfig(isProd, envContranctVer),
            web3
        )
        this.wrapper = new ContractsWrapper(
            parseInt(this.eth.chainId, 16),
            this.contracts
        )
    }
    get address() {
        return this.eth.selectedAddress
    }
    signMessage = async (msg: string) => {
        return this.eth.request({
            method: 'personal_sign',
            params: [this.eth.selectedAddress, msg],
        }) as Promise<string>
    }
    auth = () => {
        return auth(
            this.eth.selectedAddress!,
            this.eth.networkVersion,
            this.signMessage
        )
    }
    approve = async (amount: BN) => {
        // if (new BN(await this.approval()).lte(amount)) {
        return this.wrapper.approveTokens(
            this.eth.selectedAddress!,
            // new BN(await this.balance()).mul(new BN('10')),
            new BN(await this.balance()),
            this.contracts.addresses.marketplace
        )
        // }
    }
    approveNFT = async (token: string, fromContract?: string): Promise<any> => {
        return this.wrapper.approveNFT(
            this.eth.selectedAddress!,
            new BN(token),
            this.contracts.addresses.marketplace,
            fromContract
        )
    }
    createSellerSignature = async (
        price: string,
        token: string,
        isFixedPrice?: boolean
    ): Promise<string> => {
        return await this.wrapper.createSellerSignature({
            orderMaker: this.eth.selectedAddress!,
            isFixedPrice: isFixedPrice ? true : false,
            price: new BN(price),
            itemId: new BN(token),
            itemContractAddress: this.contracts.addresses.factory,
        })
    }
    getOwnedItems = async (
        contract: string,
        page: number
    ): Promise<ImportedMetaData[]> => {
        const res = await this.wrapper.getOwnedItems(
            contract,
            this.eth.selectedAddress!,
            {
                page,
                page_size: 500,
            }
        )
        // const res = await authAPI.ownedItems({ contractAddress: contract, ownerAddress: this.eth.selectedAddress! }).then(res => res.data)
        return res
            .filter((res) => res.metadata)
            .map((res) => ({
                id: res.id,
                contract,
                ...json.parse<object>(res.metadata),
            }))
    }
    getTokenURI = (contract: string, tokenId: BN) => {
        return this.wrapper.getTokenURI(contract, tokenId)
    }
    /**
     *
     * @param price Wei
     * @param extra Wei
     * @param tokenId token id
     * @returns
     */
    createBuyerSignature = async (
        price: string,
        extra: string,
        tokenId: string,
        isFixedPrice?: boolean
    ): Promise<string> => {
        return await this.wrapper.createBuyerSignature({
            orderTaker: this.eth.selectedAddress!,
            isFixedPrice: isFixedPrice ? true : false,
            price: new BN(price),
            extra: new BN(extra),
            itemId: new BN(tokenId),
            itemContractAddress: this.contracts.addresses.factory,
        })
    }
    buyWBNB = async (value: BN) => {
        return this.web3.eth.sendTransaction({
            from: this.eth.selectedAddress!,
            to: this.contracts.addresses.token,
            value,
        })
    }
    balance = async (): Promise<string> => {
        return this.wrapper.getBalanceOf(this.eth.selectedAddress!)
    }
    approval = async (): Promise<string> => {
        return this.wrapper.getTokensApproval(
            this.eth.selectedAddress!,
            this.contracts.addresses.marketplace
        )
    }
}
