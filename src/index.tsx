import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import './assets/scss/index.scss'
import { Provider } from 'react-redux'
import { store } from './store'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()
const Root = (
    <React.StrictMode>
        <Router history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </React.StrictMode>
)

ReactDOM.render(Root, document.getElementById('root'))

reportWebVitals()
