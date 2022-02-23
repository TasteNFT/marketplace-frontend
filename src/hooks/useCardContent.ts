import _ from 'lodash'
import { useMemo } from 'react'
import { ICard } from '../types/card'

export function useCardContent(card: ICard) {
    return useMemo(() => {
        return (
            card.contents.find((c) => c.isOriginal) ||
            card.contents.find((c) => c.isCensored) ||
            card.contents.find((c) => c.isWatermark) ||
            _.head(card.contents)
        )
    }, [card])
}
