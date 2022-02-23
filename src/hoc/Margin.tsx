import { FC, useMemo } from 'react'

export const Margin: FC<{
    margin: {
        right?: number
        left?: number
        top?: number
        bottom?: number
    }
}> = ({ children, margin }) => {
    const className = useMemo(() => {
        return Object.entries(margin)
            .map(([key, value]) => {
                switch (key) {
                    case 'left':
                        return `m-left-${value}`
                    case 'top':
                        return `m-top-${value}`
                    case 'right':
                        return `m-right-${value}`
                    case 'bottom':
                        return `m-bottom-${value}`
                    default:
                        return ''
                }
            })
            .join(' ')
    }, [margin])

    return <div className={className}>{children}</div>
}
