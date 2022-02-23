import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { img } from '../assets/assets'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { initialState } from '../store/reducers/popupReducer'
import { action_setOnboard } from '../store/actions/popup'
import { MetamaskLoader } from '../components/Loader'
import { ConnectWallet } from '../components/ConnectWallet'
import { createPortal } from 'react-dom'

export const PopupText = ({ text }: { text: string }) => {
    return <div className="popup__text popup__text-grey">{text}</div>
}
export const PopupHalf: FC = ({ children }) => {
    return <div className="popup-half">{children}</div>
}
export const PopupHalfItem: FC = ({ children }) => {
    return <div className="popup-half__item">{children}</div>
}

export const PopupSubmit: FC = ({ children }) => {
    return <div className="popup__submit">{children}</div>
}

export const Popup: FC<{
    title: string
    showState: [boolean, (e: boolean) => any]
    disabledClose?: boolean
}> = (props) => {
    const [active, setActive] = props.showState
    const { loading } = useTypedSelector((s) => s.popup)

    function close() {
        if (!loading && !props.disabledClose) setActive(false)
    }

    return active
        ? createPortal(
              <div className="popup">
                  <div className="popup__bg" onClick={close}></div>
                  <div className="popup__inner">
                      <div className="popup__body">
                          <div className="popup__header">
                              <div className="popup__title">{props.title}</div>
                              {!loading && !props.disabledClose ? (
                                  <div className="popup__exit">
                                      <img
                                          src={img.exitIcon}
                                          alt="exit"
                                          onClick={close}
                                      />
                                  </div>
                              ) : null}
                          </div>
                          <div className="popup__body">
                              {loading ? (
                                  <MetamaskLoader></MetamaskLoader>
                              ) : (
                                  props.children
                              )}
                          </div>
                      </div>
                  </div>
              </div>,
              document.getElementById('popup')!
          )
        : null
}

export const PopupOnboard = () => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(initialState.onboard)
    const store = useTypedSelector((state) => state.popup.onboard)
    useEffect(() => {
        setShow(store)
    }, [store])
    function set(payload: boolean) {
        dispatch(action_setOnboard(payload))
    }
    return (
        <Popup showState={[show, set]} title="Connecting wallet">
            <ConnectWallet></ConnectWallet>
        </Popup>
    )
}
