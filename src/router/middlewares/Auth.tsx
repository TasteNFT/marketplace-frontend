import { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { useTypedSelector } from '../../hooks/useTypedSelector'

interface IAuthComponent {
    children: FC | JSX.Element
}

export const AuthMiddleware = (props: IAuthComponent) => {
    const { children } = props
    const auth = useTypedSelector((state) => state.auth)

    return <>{auth.id ? children : <Redirect to="/"></Redirect>}</>
}
