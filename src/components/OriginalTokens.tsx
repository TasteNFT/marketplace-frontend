import { ELotSaleType, ITokenOriginalView } from '../types/lot'
import { ECardType, ICard } from '../types/card'
import { Cards } from './UI/Card/List'
import { CardDetail } from './UI/Card/Detail'
import { ContractVersion } from '../utils/modules/contract/types'
import _ from 'lodash'

interface IPropsList {
    tokens: ITokenOriginalView[]
}
interface IPropsDetail {
    token: ITokenOriginalView
}

export function dataFromOriginalTokenToCard(token: ITokenOriginalView): ICard {
    const lot = _.head(token.Lots || [])
    // const { auth } = useTypedSelector(s => s)
    return {
        cardType: ECardType.originalToken,
        id: token.id,
        name: token.name,
        description: token.description,
        copiesTotal: token.copiesTotal,
        minimalCost: lot?.minimalCost,
        copiesSold: lot?.copiesSold,
        contents: token.TokenMedias || [],
        typeFile: token.contentType,
        status: token.status,
        User: token.User,
        TokensNFT: token.TokensNFT,
        moderatorMessage: token.moderatorMessage || '',
        isUseCensored: token.isUseCensored,
        Lots: token.Lots,
        isCommercial: token.isCommercial,
        marketplaceVer: lot?.marketplaceVer as ContractVersion,
        saleType: lot?.type as ELotSaleType | undefined,
        creatorReward: token.creatorReward,
        originalType: token.type,
    }
}

export function fromTokenToCard(tokens: ITokenOriginalView[]) {
    return tokens.map((t) => dataFromOriginalTokenToCard(t))
}

export const List = ({ tokens }: IPropsList) => {
    const cards: ICard[] = tokens.map((l) => dataFromOriginalTokenToCard(l))
    return <Cards cards={cards}></Cards>
}

export const Detail = ({ token }: IPropsDetail) => {
    const card: ICard = dataFromOriginalTokenToCard(token)
    return <CardDetail card={card}></CardDetail>
}
