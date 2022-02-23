import { BN } from 'bn.js'
import { ICard } from '../../types/card'
import { ITokenNFTView, signsData } from '../../types/lot'
import { ContractVersion } from '../modules/contract/types'
import { createConfigWithEnvType } from '../wallet/metamask/methods'
import { MetamaskMethods } from '../wallet/metamask/provider'
import { fromStringToWei } from '../wallet/utils'
import { lot as lotAPI } from '../api'

/**
 *
 * @param card
 * @param betAmount - not wei
 * @param contractVersion
 */
export async function lotPlaceABet(
    card: ICard,
    betAmount: string,
    contractVersion?: ContractVersion
) {
    const { approve, createBuyerSignature, contracts } = await MetamaskMethods()
    contracts.updateConfig(createConfigWithEnvType(contractVersion))

    const betAmountBn = new BN(fromStringToWei(betAmount))

    await approve(betAmountBn)

    const result: signsData[] = []
    for (const token of card.TokensNFT || []) {
        const price = new BN(card.minimalCost || '0').lte(new BN('0'))
            ? '1'
            : card.minimalCost!

        const extra = betAmountBn.sub(new BN(price)).toString()
        // console.log('extra', extra)

        const sign = await createBuyerSignature(price, extra, token.token)

        result.push({
            tokenNftId: token.id,
            sign,
        })
    }
    contracts.updateConfig(createConfigWithEnvType())
    await lotAPI.placeABet({
        lotId: card.id,
        betAmount: betAmountBn.toString(),
        buyerSignsData: result,
    })
}

/**
 *
 * @param lotId - lot id
 * @param price - price in wei
 * @param token - token nft
 * @returns
 */
export async function buyALot(
    lotId: string,
    price: string,
    token: ITokenNFTView
) {
    const { approve, createBuyerSignature } = await MetamaskMethods()
    await approve(new BN(price))

    const sign = await createBuyerSignature(price, '0', token.token, true)

    return lotAPI.buy({
        lotId,
        tokenNftId: token.id,
        buyerSignData: sign,
    })
}
