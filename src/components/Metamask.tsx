import { useState } from 'react'
import { img } from '../assets/assets'
import { Margin } from '../hoc/Margin'
import { Popup } from '../hoc/Popup'
// import { loginAsMetamask } from '../utils/wallet/auth'
import { loginAsMetamask, loginAsWalletConnect } from '../utils/wallet/auth'
import { Button } from './UI/Buttons'

export const Metamask = () => {
    const [show, setShow] = useState(false)
    return (
        <>
            <Button
                className="header__connect"
                size="large"
                onClick={() => setShow(true)}
            >
                Connect wallet
            </Button>

            <Popup showState={[show, setShow]} title="Connect your wallet">
                <div className="popup__actions">
                    <Button
                        icon={<img src={img.metamaskLogo} alt=""></img>}
                        onClick={loginAsMetamask}
                        fill
                        stylePreset="orange"
                    >
                        Metamask
                    </Button>
                    <Margin margin={{ top: 20 }}>
                        <Button
                            icon={
                                <img src={img.walletConnectLogo} alt=""></img>
                            }
                            onClick={loginAsWalletConnect}
                            fill
                        >
                            Wallet Connect
                        </Button>
                    </Margin>
                </div>
            </Popup>
        </>
    )
}
