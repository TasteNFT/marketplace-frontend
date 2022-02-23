import { Popup } from '../../hoc/Popup'
import { useShare } from '../../hooks/useShare'
import { copyToClipboard } from '../../utils/methods'
import { notifications } from '../../utils/notification'

interface IProps {
    show: [boolean, (state: boolean) => void]
    link?: string
}

export const Share = ({ show, link }: IProps) => {
    const share = useShare('TasteNFT', link)
    function copy() {
        copyToClipboard(link ? link : window.location.toString())
        notifications.copied()
        const [, setSt] = show
        setSt(false)
    }
    return (
        <Popup showState={show} title="Share this page">
            <div className="share">
                <div className="share__item" onClick={share.twitter}>
                    <i className="fab fa-twitter"></i>
                </div>
                <div className="share__item" onClick={share.telegram}>
                    <i className="fab fa-telegram-plane"></i>
                </div>
                <div className="share__item" onClick={share.facebook}>
                    <i className="fab fa-facebook-f"></i>
                </div>
                <div className="share__item" onClick={copy}>
                    <i className="fas fa-copy"></i>
                </div>
            </div>
        </Popup>
    )
}
