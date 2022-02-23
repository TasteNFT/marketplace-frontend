import { useEffect } from 'react'
import { useState } from 'react'
import SwiperCore, { Pagination, EffectCoverflow } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ILot } from '../types/lot'
import { dataFromLotToCard } from './Lots'
import { CardInfo } from './UI/Card/Info'
import { CardFile } from './UI/Card/File'
import _ from 'lodash'

SwiperCore.use([Pagination, EffectCoverflow])

export interface TopLotsCarouselProps {
    Lots: ILot[]
}
export const TopLotsCarousel = ({ Lots }: TopLotsCarouselProps) => {
    const [lot, setLot] = useState<ILot>()

    function setId(id: string) {
        const l = Lots.find((lot) => lot.id === id)
        setLot(l)
    }

    useEffect(() => {
        setLot(_.head(Lots))
    }, [Lots])

    return lot ? (
        <CardInfo card={dataFromLotToCard(lot)} type="carousel" reverseWrap>
            <Swiper
                effect="coverflow"
                initialSlide={0}
                centeredSlides={true}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 100,
                    depth: 100,
                    modifier: 2,
                    slideShadows: false,
                }}
                pagination={{
                    clickable: true,
                }}
                onSlideChange={(e) => setId(e.realIndex.toString())}
            >
                {Lots.map((s) => (
                    <SwiperSlide key={s.id} virtualIndex={+s.id}>
                        <CardFile card={dataFromLotToCard(s)}></CardFile>
                    </SwiperSlide>
                ))}
            </Swiper>
        </CardInfo>
    ) : null
}
