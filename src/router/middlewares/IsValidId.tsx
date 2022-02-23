import { FC } from 'react'
import { Redirect, useParams } from 'react-router'

export const IsValidId: FC = ({ children }) => {
    const { id } = useParams<{ id?: string }>()
    const numId = id ? +id : 0
    return <>{numId ? children : <Redirect to="/"></Redirect>}</>
}
