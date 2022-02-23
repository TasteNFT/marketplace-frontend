import { ELotSaleType, ITokenNFTView, signsData } from '../../types/lot'
import { ContractVersion } from '../modules/contract/types'
import { createConfigWithEnvType } from '../wallet/metamask/methods'
import { MetamaskMethods } from '../wallet/metamask/provider'
import { fromStringToWei } from '../wallet/utils'
import { lot as lotAPI } from '../api'
/**
 *
 * @param tokens
 * @param price Wei
 * @param {Boolean} isFixedPrice
 * @param {ContractVersion} contractVersion
 */
export async function signNFTTransactions(
    tokens: ITokenNFTView[],
    price: string,
    isFixedPrice?: boolean,
    contractVersion?: ContractVersion
) {
    const { createSellerSignature, approveNFT, contracts } =
        await MetamaskMethods()

    contracts.updateConfig(createConfigWithEnvType(contractVersion))

    const result: signsData[] = []
    for (const token of tokens) {
        result.push({
            tokenNftId: token.id,
            sign: await createSellerSignature(price, token.token, isFixedPrice),
        })
        await approveNFT(token.token)
    }
    contracts.updateConfig(createConfigWithEnvType())
    return result
}

export async function createAuction({
    picked,
    price,
    tokenOriginalId,
    expiresOffsetSec,
    testContrVer,
}: {
    picked: ITokenNFTView[]
    price: string
    tokenOriginalId: string
    expiresOffsetSec?: number
    testContrVer: string
}) {
    const signsData = await signNFTTransactions(
        picked,
        +price <= 0 ? '1' : fromStringToWei(price),
        false,
        +testContrVer as ContractVersion
    )
    return lotAPI.create(
        {
            saleType: ELotSaleType.AUCTION,
            tokenOriginalId,
            minimalCost: fromStringToWei(price),
            sellerSignsData: signsData,
            expiresOffsetSec: expiresOffsetSec || null,
        },
        { oldContract: +testContrVer === 1 }
    )
}

export async function createSale({
    picked,
    price,
    tokenOriginalId,
    testContrVer,
}: {
    picked: ITokenNFTView[]
    price: string
    tokenOriginalId: string
    testContrVer: string
}) {
    const signsData = await signNFTTransactions(
        picked,
        +price <= 0 ? '1' : fromStringToWei(price),
        true,
        +testContrVer as ContractVersion
    )
    return lotAPI.create(
        {
            saleType: ELotSaleType.SALE,
            tokenOriginalId,
            minimalCost: fromStringToWei(price),
            sellerSignsData: signsData,
            expiresOffsetSec: null,
        },
        { oldContract: +testContrVer === 1 }
    )
}
