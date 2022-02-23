import { Index } from '../views/Index'
import { Profile } from '../views/Profile'
import { LotDetail } from '../views/Lot'
import { User } from '../views/User'
import { TokenDetail } from '../views/TokenOriginal'
import { Search } from '../views/Search'

import { AuthMiddleware } from './middlewares/Auth'

import { Switch, Route, Redirect } from 'react-router-dom'
import { IsValidId } from './middlewares/IsValidId'

export const Router = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Index></Index>
            </Route>
            <Route path="/profile" exact>
                <AuthMiddleware>
                    <Profile></Profile>
                </AuthMiddleware>
            </Route>
            <Route path="/lot/:id">
                <IsValidId>
                    <LotDetail></LotDetail>
                </IsValidId>
            </Route>
            <Route path="/original-token/:id">
                <IsValidId>
                    <TokenDetail></TokenDetail>
                </IsValidId>
            </Route>
            <Route path="/user/:id">
                <User></User>
            </Route>
            <Route path="/search/">
                <Search></Search>
            </Route>
            <Route path="/*">
                <Redirect to="/"></Redirect>
            </Route>
        </Switch>
    )
}
