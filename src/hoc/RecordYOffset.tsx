import { FC, MouseEvent } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { useTypedLocation } from '../hooks/useTypedLocation'

export const RecordYOffsetLink: FC<LinkProps> = (props) => {
    const { setPageYOffset } = useTypedLocation()
    function onClick(e: MouseEvent<HTMLAnchorElement>) {
        setPageYOffset()
        if (props.onClick) props.onClick(e)
    }
    return (
        <Link {...props} onClick={onClick}>
            {props.children}
        </Link>
    )
}
