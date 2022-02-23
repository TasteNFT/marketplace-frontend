import { img } from '../assets/assets'

export const ConnectWallet = () => {
    return (
        <div className="connect-wallet">
            <div className="connect-wallet__item">
                <div className="connect-wallet__item-video" data-number="1">
                    <div className="connect-wallet__play">
                        <img src={img.playIcon} alt="play" />
                    </div>
                    <img src={img.connectVideo} alt="video" />
                </div>
                <div className="connect-wallet__text">
                    Описание что нужно сделать
                </div>
            </div>
        </div>
    )
}
