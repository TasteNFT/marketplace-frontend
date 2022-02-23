import { forwardRef } from 'react'
import { img } from '../../../assets/assets'
import { useCardContent } from '../../../hooks/useCardContent'
import { ICard } from '../../../types/card'
import { EMediaType } from '../../../types/lot'

export const CardFile = forwardRef<
    any,
    {
        card: ICard
    }
>(({ card }, ref) => {
    const content = useCardContent(card)
    switch (content?.type) {
        case EMediaType.IMAGE:
            return (
                <img
                    src={`/sha256/${content.sha256}${
                        !content.isOriginal ? ':fullhd' : ''
                    }`}
                    alt="alt"
                    ref={ref}
                />
            )
        case EMediaType.VIDEO:
            return (
                <video
                    autoPlay
                    muted
                    loop
                    className={
                        card.isUseCensored && !content.isOriginal ? 'blur' : ''
                    }
                    ref={ref}
                    controls={card.isUseCensored ? false : true}
                >
                    <source
                        src={`/sha256/${content.sha256}${
                            !content.isOriginal ? ':fullhd' : ''
                        }`}
                        type="video/mp4"
                    />
                </video>
            )
        case EMediaType.AUDIO:
            return <audio src={`/sha256/${content.sha256}`} controls></audio>
        default:
            return <img src={img.lotImg1} alt="empty lot"></img>
    }
})
