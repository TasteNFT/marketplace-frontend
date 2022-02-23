import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Router } from './router/Router'
import { action_authFetch } from './store/actions/auth'
import { Loader } from './components/Loader'
import { Header } from './components/Header'
import { Popup, PopupOnboard, PopupSubmit, PopupText } from './hoc/Popup'
import { Button } from './components/UI/Buttons'
import { Checkbox } from './components/UI/Checkbox'
import { scroll } from './utils/methods'

const Application = () => {
    const [popupAge, setPopupAge] = useState(
        localStorage.getItem('popup_age') ? false : true
    )
    const [iAm18, setIAm18] = useState(false)

    function closePopupAge() {
        localStorage.setItem('popup_age', 'true')
        setPopupAge(false)
    }

    useEffect(() => {
        if (popupAge) return scroll.disable()
        scroll.enable()
    }, [popupAge])

    return (
        <div className="wrapper">
            <Header></Header>
            <div className="main container">
                <Router></Router>
            </div>
            <PopupOnboard></PopupOnboard>
            <Popup
                disabledClose
                showState={[popupAge, closePopupAge]}
                title="Confirm your age"
            >
                <PopupText text="This category contains some content which is age restricted"></PopupText>
                <Checkbox
                    state={[iAm18, setIAm18]}
                    title="I am 18 years old or older"
                ></Checkbox>
                <PopupSubmit>
                    <Button fill disabled={!iAm18} onClick={closePopupAge}>
                        Proceed
                    </Button>
                </PopupSubmit>
            </Popup>
        </div>
    )
}

export function App() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const init = useCallback(async () => {
        await dispatch(action_authFetch())
        setLoading(false)
    }, [dispatch])

    useEffect(() => {
        init()
    }, [init])

    return loading ? <Loader></Loader> : <Application></Application>
}
