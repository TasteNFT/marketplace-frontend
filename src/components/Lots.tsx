import {
    EMediaType,
    ETokenOriginalType,
    ILot,
    TokenHistoryView,
} from '../types/lot'
import { ECardType, ICard } from '../types/card'
import { Cards } from './UI/Card/List'
import { CardDetail } from './UI/Card/Detail'
import { ContractVersion } from '../utils/modules/contract/types'

interface IPropsList {
    lots: ILot[]
}
interface IPropsDetail {
    lot: ILot
    activities?: TokenHistoryView[]
}

export function dataFromLotToCard(lot: ILot): ICard {
    const TokensNFT = lot.LotTokens?.map((t) => t.TokenNFT!)

    return {
        cardType: ECardType.lot,
        id: lot.id,
        name: lot.TokenOriginal?.name || '',
        description: lot.TokenOriginal?.description || '',
        copiesTotal: lot.copiesTotal,
        minimalCost: lot.minimalCost,
        currentCost: lot.currentCost,
        copiesSold: lot.copiesSold,
        contents: lot.TokenOriginal?.TokenMedias || [],
        typeFile: lot.TokenOriginal?.contentType || EMediaType.IMAGE,
        status: lot.status,
        User: lot.User,
        LotTokens: lot.LotTokens,
        TokensNFT: TokensNFT,
        isUseCensored: lot.TokenOriginal?.isUseCensored || false,
        isCommercial: lot.TokenOriginal?.isCommercial || false,
        LastBet: lot.Bets?.find(() => true),
        marketplaceVer: lot.marketplaceVer as ContractVersion,
        expired: lot.expiresAt as Date | undefined,
        saleType: lot.saleType,
        creatorReward: lot.TokenOriginal?.creatorReward,
        originalType: lot.TokenOriginal?.type || ETokenOriginalType.LOCAL,
    }
}

export function fromLotsToCard(lots: ILot[]) {
    return lots.map((l) => dataFromLotToCard(l))
}

export const List = ({ lots }: IPropsList) => {
    const cards: ICard[] = lots.map((l) => dataFromLotToCard(l))
    return <Cards cards={cards}></Cards>
}

export const Detail = ({ lot, activities }: IPropsDetail) => {
    const card: ICard = dataFromLotToCard(lot)
    return <CardDetail card={card} activities={activities}></CardDetail>
}
